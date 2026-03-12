import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const envCheck = {
      razorpay: {
        keyIdExists: !!process.env.RAZORPAY_KEY_ID,
        keySecretExists: !!process.env.RAZORPAY_KEY_SECRET,
        keyIdPreview: process.env.RAZORPAY_KEY_ID ? `${process.env.RAZORPAY_KEY_ID.substring(0, 12)}...` : 'missing',
        keySecretLength: process.env.RAZORPAY_KEY_SECRET?.length || 0,
        keyIdStartsWith: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_') || process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') || false,
      },
      mongodb: {
        uriExists: !!process.env.MONGODB_URI,
        uriPreview: process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 20)}...` : 'missing',
      },
      smtp: {
        hostExists: !!process.env.SMTP_HOST,
        userExists: !!process.env.SMTP_USER,
        passExists: !!process.env.SMTP_PASS,
      },
      nextauth: {
        secretExists: !!process.env.NEXTAUTH_SECRET,
      },
      nodeEnv: process.env.NODE_ENV,
    };

    return NextResponse.json({ envCheck });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check environment' }, { status: 500 });
  }
}
