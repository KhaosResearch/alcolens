import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/app/lib/db';
import Patient from '@/app/lib/models/Patient';

const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest) {
  // Only doctors can create anonymous patient records
  const token = await getToken({ req, secret });

  if (!token || (token as any).role !== 'doctor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await connectDB();

    const patient = await Patient.create({});

    return NextResponse.json({ patientId: patient._id.toString() }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
