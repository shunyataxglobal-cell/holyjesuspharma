import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import OTP from '@/models/OTP';
import bcrypt from 'bcryptjs';
import { isOTPExpired } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password, otp } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist. Please sign up first.' },
        { status: 404 }
      );
    }

    if (otp) {
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

      if (!user.verified) {
        user.verified = true;
        await user.save();
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email.split('@')[0],
          role: user.role,
        },
      });
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password or OTP is required' },
        { status: 400 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { error: 'Please login with OTP' },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name || user.email.split('@')[0],
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}