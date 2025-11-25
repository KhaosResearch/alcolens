import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/app/lib/db';
import InviteToken from '@/app/lib/models/InviteToken';
import ResponseModel from '@/app/lib/models/Response';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, questionnaireId, answers, markSingleUse = true } = body;

    if (!token || !answers) {
      return NextResponse.json({ error: 'Missing token or answers' }, { status: 400 });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await connectDB();

    const invite = await InviteToken.findOne({ tokenHash });
    if (!invite) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 410 });
    }

    if (invite.used) {
      return NextResponse.json({ error: 'Token already used' }, { status: 410 });
    }

    // Store response without PII
    const resp = await ResponseModel.create({
      patientId: invite.patientId,
      questionnaireId,
      answers,
    });

    // Optionally mark token as used (single use)
    if (markSingleUse) {
      invite.used = true;
      await invite.save();
    }

    return NextResponse.json({ success: true, responseId: resp._id.toString() }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
