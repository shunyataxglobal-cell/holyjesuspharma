import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Consultation from '@/models/Consultation';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'fullName', 'email', 'phone', 'dateOfBirth', 'gender', 'age',
      'address', 'symptoms', 'medications', 'allergies', 'chronicCondition',
      'consultationDate', 'consultationTime', 'consultationType',
      'emergencyContactName', 'emergencyContactNumber'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    const newConsultation = await Consultation.create({
      user: (session.user as any).id,
      ...data,
      status: 'pending'
    });

    return NextResponse.json({ success: true, consultation: newConsultation });
  } catch (error) {
    console.error('Consultation POST error:', error);
    return NextResponse.json({ error: 'Failed to book consultation' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userRole = (session.user as any).role;
    
    let consultations: any[] = [];
    
    if (userRole === 'doctor') {
      const { default: Doctor } = await import('@/models/Doctor');
      const docRecord = await Doctor.findOne({ email: session.user.email });
      if (docRecord) {
        consultations = await Consultation.find({ assignedDoctor: docRecord._id })
          .populate('assignedDoctor')
          .sort({ createdAt: -1 });
      } else {
        consultations = [];
      }
    } else {
      consultations = await Consultation.find({ user: (session.user as any).id })
        .populate('assignedDoctor')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ consultations });
  } catch (error) {
    console.error('Consultation GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}
