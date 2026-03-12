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

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay credentials not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
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

    const rzpOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `consultation_${consultationId}_${Date.now()}`,
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
  } catch (error) {
    console.error('Consultation payment error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
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
