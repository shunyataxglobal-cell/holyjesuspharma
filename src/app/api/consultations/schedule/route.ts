import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Consultation from '@/models/Consultation';
import Doctor from '@/models/Doctor';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { consultationId, scheduledDate, scheduledTime, scheduledTimeIST } = await request.json();

    const consultation = await Consultation.findById(consultationId).populate('assignedDoctor');
    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    const userRole = (session.user as any)?.role;
    const doctor = await Doctor.findOne({ email: session.user.email });

    if (userRole === 'doctor' && doctor) {
      if (consultation.assignedDoctor?.toString() !== doctor._id.toString()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    } else if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updatedConsultation = await Consultation.findByIdAndUpdate(
      consultationId,
      {
        scheduledDate,
        scheduledTime,
        scheduledTimeIST,
        status: 'scheduled',
      },
      { new: true }
    ).populate('assignedDoctor');

    if (!updatedConsultation) {
      return NextResponse.json({ error: 'Failed to update consultation' }, { status: 500 });
    }

    const { sendConsultationScheduledEmailToUser } = await import('@/lib/consultation-email');
    
    await sendConsultationScheduledEmailToUser(
      consultation.email,
      consultation.fullName,
      (updatedConsultation.assignedDoctor as any)?.name || 'Doctor',
      scheduledDate,
      scheduledTimeIST,
      consultation.consultationType
    );

    return NextResponse.json({ success: true, consultation: updatedConsultation });
  } catch (error) {
    console.error('Schedule consultation error:', error);
    return NextResponse.json({ error: 'Failed to schedule consultation' }, { status: 500 });
  }
}
