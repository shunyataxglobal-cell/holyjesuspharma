import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { generateOTP } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, forSignup } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!forSignup) {
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return NextResponse.json(
          { error: 'User does not exist. Please sign up first.' },
          { status: 404 }
        );
      }
    } else {
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists. Please login instead.' },
          { status: 400 }
        );
      }
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.deleteMany({ email: normalizedEmail });

    await OTP.create({
      email: normalizedEmail,
      otp,
      expiresAt,
    });

    await sendOTPEmail(normalizedEmail, otp);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}