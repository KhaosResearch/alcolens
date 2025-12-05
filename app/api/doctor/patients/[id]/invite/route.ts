import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/app/lib/db';
import InviteToken from '@/app/lib/models/InviteToken';
import Patient from '@/app/lib/models/Patient';

const SECRET = process.env.NEXTAUTH_SECRET;
const NEXT_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_FROM;

async function sendSms(to: string, body: string) {
  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) return false;
  try {
    const twilio = require('twilio');
    if (!twilio) return false;
    const client = twilio(TWILIO_SID, TWILIO_TOKEN);
    await client.messages.create({ body, from: TWILIO_FROM, to });
    return true;
  } catch (e) {
    console.error('Twilio send error', e);
    return false;
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getToken({ req, secret: SECRET });
  if (!token || (token as any).role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const doctorId = (token as any).id;
  const patientId = id;

  try {
    await connectDB();

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const body = await req.json();
    const { phone, expiresInDays = 7, singleUse = true } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required to send SMS' }, { status: 400 });
    }

    // generate token and hash
    const tokenPlain = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(tokenPlain).digest('hex');

    const expiresAt = new Date(Date.now() + (expiresInDays as number) * 24 * 60 * 60 * 1000);

    const invite = await InviteToken.create({
      patientId: patient._id,
      tokenHash,
      createdBy: doctorId,
      expiresAt,
    });

    const link = `${NEXT_URL}/invite?token=${tokenPlain}`;

    // send SMS but DO NOT persist phone in DB
    const smsSent = await sendSms(phone, `You have been invited: ${link}`);

    return NextResponse.json({ success: true, smsSent, link: smsSent ? undefined : link });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
