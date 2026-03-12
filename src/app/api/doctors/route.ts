import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Doctor from '@/models/Doctor';
import { getServerSession } from 'next-auth';
import { getCloudinary } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    let query = Doctor.find();
    if (limit) query = query.limit(parseInt(limit));
    const doctors = await query.exec();
    return NextResponse.json({ doctors });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const doctor = await Doctor.create(data);
    return NextResponse.json({ success: true, doctor });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add doctor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, ...updateData } = data;
    const existing = await Doctor.findById(_id);
    if (!existing) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const newPublicId = updateData.cloudinaryPublicId as string | undefined;
    const changingImage = typeof updateData.image === 'string' && updateData.image && updateData.image !== existing.image;
    const changingPublicId = typeof newPublicId === 'string' && newPublicId && newPublicId !== (existing as any).cloudinaryPublicId;

    if ((changingImage || changingPublicId) && (existing as any).cloudinaryPublicId) {
      try {
        const cloudinary = getCloudinary();
        await cloudinary.uploader.destroy((existing as any).cloudinaryPublicId, { resource_type: 'image' });
      } catch (e) {
        console.error('Cloudinary destroy failed:', e);
      }
    }

    const doctor = await Doctor.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json({ success: true, doctor });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { id } = await request.json();
    const deletedDoctor = await Doctor.findByIdAndDelete(id);
    if (!deletedDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
    if ((deletedDoctor as any).cloudinaryPublicId) {
      try {
        const cloudinary = getCloudinary();
        await cloudinary.uploader.destroy((deletedDoctor as any).cloudinaryPublicId, { resource_type: 'image' });
      } catch (e) {
        console.error('Cloudinary destroy failed:', e);
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
