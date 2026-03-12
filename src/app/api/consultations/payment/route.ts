import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Consultation from '@/models/Consultation';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Debug: Log environment variable status (without exposing secrets)
    const keyIdExists = !!process.env.RAZORPAY_KEY_ID;
    const keySecretExists = !!process.env.RAZORPAY_KEY_SECRET;
    const keyIdPreview = process.env.RAZORPAY_KEY_ID ? `${process.env.RAZORPAY_KEY_ID.substring(0, 12)}...` : 'missing';
    const keySecretLength = process.env.RAZORPAY_KEY_SECRET?.length || 0;

    console.log('Razorpay credentials check:', {
      keyIdExists,
      keySecretExists,
      keyIdPreview,
      keySecretLength,
      nodeEnv: process.env.NODE_ENV,
    });

    if (!keyIdExists || !keySecretExists) {
      console.error('Razorpay credentials missing:', {
        hasKeyId: keyIdExists,
        hasKeySecret: keySecretExists,
        hint: 'Make sure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are in .env.local file in the root directory'
      });
      return NextResponse.json({ 
        error: 'Razorpay credentials not configured',
        hint: 'Please check your .env.local file and restart the server'
      }, { status: 500 });
    }

    // Validate credential format
    const keyId = process.env.RAZORPAY_KEY_ID?.trim() || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || '';
    
    if (!keyId) {
      return NextResponse.json({ 
        error: 'RAZORPAY_KEY_ID is empty. Please check your .env.local file.' 
      }, { status: 500 });
    }

    if (!keySecret) {
      return NextResponse.json({ 
        error: 'RAZORPAY_KEY_SECRET is empty. Please check your .env.local file.' 
      }, { status: 500 });
    }
    
    if (!keyId.startsWith('rzp_test_') && !keyId.startsWith('rzp_live_')) {
      console.error('Invalid Razorpay Key ID format:', keyId.substring(0, 10) + '...');
      return NextResponse.json({ 
        error: 'Invalid Razorpay Key ID format. Must start with rzp_test_ or rzp_live_',
        received: keyId.substring(0, 15) + '...'
      }, { status: 500 });
    }

    if (keySecret.length < 20) {
      console.error('Razorpay Key Secret appears incomplete. Length:', keySecret.length);
      return NextResponse.json({ 
        error: 'Razorpay Key Secret appears incomplete. Please check your .env.local file.',
        hint: 'Razorpay secrets are typically 32 characters long. Current length: ' + keySecret.length,
        action: 'Please verify your complete secret key from Razorpay dashboard'
      }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    await connectDB();
    const { consultationId, selectedDoctorId } = await request.json();

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    if (consultation.user.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const consultationFee = consultation.consultationFee || 500;
    const amount = Math.round(consultationFee * 100);

    if (amount < 100) {
      return NextResponse.json({ error: 'Amount must be at least ₹1 (100 paise)' }, { status: 400 });
    }

    try {
      const receiptId = `cons_${consultationId.toString().substring(18)}_${Date.now().toString().slice(-8)}`;
      const rzpOrder = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: receiptId.substring(0, 40),
      });

      await Consultation.findByIdAndUpdate(consultationId, {
        razorpayOrderId: rzpOrder.id,
        assignedDoctor: selectedDoctorId,
        status: 'pending',
      });

      return NextResponse.json({
        success: true,
        razorpayOrder: rzpOrder,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (rzpError: any) {
      console.error('Razorpay API error:', {
        statusCode: rzpError.statusCode,
        error: rzpError.error,
        message: rzpError.message,
        keyId: process.env.RAZORPAY_KEY_ID ? `${process.env.RAZORPAY_KEY_ID.substring(0, 10)}...` : 'missing',
      });
      
      if (rzpError.statusCode === 401) {
        return NextResponse.json({ 
          error: 'Razorpay authentication failed. Please check your API credentials in .env file.',
          details: 'Make sure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correct test credentials'
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: rzpError.error?.description || 'Failed to create payment order',
        details: rzpError.error
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Consultation payment error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create payment order',
      details: error
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, consultationId } = body;

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
    }

    await connectDB();
    const consultation = await Consultation.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, _id: consultationId },
      {
        paymentStatus: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'assigned',
      },
      { new: true }
    ).populate('assignedDoctor');

    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    const { sendConsultationBookingEmailToDoctor } = await import('@/lib/consultation-email');
    
    if (consultation.assignedDoctor && (consultation.assignedDoctor as any).email) {
      await sendConsultationBookingEmailToDoctor(
        (consultation.assignedDoctor as any).email,
        (consultation.assignedDoctor as any).name,
        consultation._id.toString(),
        consultation.fullName,
        consultation.email,
        consultation.phone,
        consultation.symptoms
      );
    }

    return NextResponse.json({ success: true, consultation });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
