import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Doctor from '@/models/Doctor';
import { doctors } from '@/data/doctors';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Clear existing to avoid duplicates if rerun
    await Doctor.deleteMany({});

    // Transform static data into mongoose format
    const docsToInsert = doctors.map(d => ({
       name: d.name,
       designation: d.designation || 'Specialist',
       hospital: d.hospital || 'Holy Jesus PharmaRX',
       image: d.image || '/images/doctor-placeholder.png',
       education: d.education || [],
       experience: d.experience || [],
       interests: d.interests || []
    }));

    await Doctor.insertMany(docsToInsert);

    return NextResponse.json({ success: true, count: docsToInsert.length, message: 'Doctors seeded successfully' });
  } catch (error) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: 'Failed to seed doctors' }, { status: 500 });
  }
}
