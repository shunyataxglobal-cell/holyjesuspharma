import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import OTP from '@/models/OTP';
import { isOTPExpired } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      otp: otp.toString(),
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    if (isOTPExpired(otpRecord.createdAt) || new Date() > otpRecord.expiresAt) {
      await OTP.findByIdAndDelete(otpRecord._id);
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    await OTP.findByIdAndDelete(otpRecord._id);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}