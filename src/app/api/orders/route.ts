import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay credentials not configured' }, { status: 500 });
    }

    // Initialize Razorpay only when needed (at runtime, not build time)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    await connectDB();
    const data = await request.json();
    
    // Create razorpay order first
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(data.total * 100),
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`
    });

    const newOrder = await Order.create({
      user: (session.user as any).id,
      items: data.items,
      subtotal: data.subtotal,
      shipping: data.shipping,
      gst: data.gst,
      discount: data.discount,
      total: data.total,
      shippingAddress: data.shippingAddress,
      razorpayOrderId: rzpOrder.id,
      paymentStatus: 'pending',
      status: 'processing'
    });

    return NextResponse.json({ success: true, keyId: process.env.RAZORPAY_KEY_ID, order: newOrder, razorpayOrder: rzpOrder });
  } catch (error) {
    console.error('Create Order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ user: (session.user as any).id }).sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
     const body = await request.json();
     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

     const text = `${razorpay_order_id}|${razorpay_payment_id}`;
     const generated_signature = crypto
       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
       .update(text)
       .digest("hex");

     if (generated_signature !== razorpay_signature) {
       return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
     }

     await connectDB();
     const order = await Order.findOneAndUpdate(
       { razorpayOrderId: razorpay_order_id },
       { paymentStatus: 'completed', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature },
       { new: true }
     );

     return NextResponse.json({ success: true, order });
  } catch(error) {
     return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
