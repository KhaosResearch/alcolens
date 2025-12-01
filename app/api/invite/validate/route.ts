import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/app/lib/db';
import InviteToken from '@/app/lib/models/InviteToken';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    if (!token) return NextResponse.json({ valid: false }, { status: 400 });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await connectDB();

    const invite = await InviteToken.findOne({ tokenHash });
    if (!invite) return NextResponse.json({ valid: false }, { status: 404 });

    if (invite.used) return NextResponse.json({ valid: false, reason: 'used' }, { status: 410 });

    if (invite.expiresAt < new Date()) return NextResponse.json({ valid: false, reason: 'expired' }, { status: 410 });

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
