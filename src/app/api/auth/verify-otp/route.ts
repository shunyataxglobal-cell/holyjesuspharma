import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
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

    if (isOTPExpired(otpRecord.createdAt)) {
      await OTP.findByIdAndDelete(otpRecord._id);
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.findByIdAndDelete(otpRecord._id);
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        email: normalizedEmail,
        verified: true,
        role: 'user',
      });
    } else {
      if (!user.role) {
        user.role = 'user';
      }
      user.verified = true;
      await user.save();
    }

    await OTP.findByIdAndDelete(otpRecord._id);

    const updatedUser = await User.findById(user._id);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        name: updatedUser.name || updatedUser.email.split('@')[0],
        role: updatedUser.role || 'user',
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}