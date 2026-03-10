import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Consultation from '@/models/Consultation';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const consultations = await Consultation.find({})
      .populate('user', 'email name')
      .populate('assignedDoctor')
      .sort({ createdAt: -1 });

    return NextResponse.json({ consultations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { id, assignedDoctor, status } = await request.json();

    const consult = await Consultation.findByIdAndUpdate(
      id,
      { assignedDoctor, status },
      { new: true }
    );

    return NextResponse.json({ success: true, consult });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { id } = await request.json();
    const deletedConsultation = await Consultation.findByIdAndDelete(id);
    if (!deletedConsultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete consultation' }, { status: 500 });
  }
}
