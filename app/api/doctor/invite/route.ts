import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nih, phone } = body;

        // 1. Generate Link
        const origin = req.headers.get('origin') || 'http://localhost:3000';
        const link = nih
            ? `${origin}/patient/audit?id=${nih}`
            : `${origin}/patient/audit`;

        // 2. Send SMS (if phone provided)
        let smsStatus = 'skipped';

        if (phone) {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const fromNumber = process.env.TWILIO_PHONE_NUMBER;

            if (accountSid && authToken && fromNumber) {
                // Real Twilio Sending
                try {
                    const client = twilio(accountSid, authToken);
                    await client.messages.create({
                        body: `Hola, le invitamos a realizar su evaluación de salud en Alcolens: ${link}`,
                        from: fromNumber,
                        to: phone.startsWith('+') ? phone : `+34${phone.replace(/\s/g, '')}` // Ensure E.164 format (assuming Spain +34 if missing)
                    });
                    smsStatus = 'sent';
                    console.log(`[Twilio] SMS sent to ${phone}`);
                } catch (twilioError) {
                    console.error('[Twilio] Error sending SMS:', twilioError);
                    smsStatus = 'failed';
                }
            } else {
                // Simulation Mode
                console.log('================================================');
                console.log('[SMS SIMULATION] Keys not found in .env');
                console.log(`To: ${phone}`);
                console.log(`Message: Hola, le invitamos a realizar su evaluación de salud en Alcolens: ${link}`);
                console.log('================================================');
                smsStatus = 'simulated';
            }
        }

        return NextResponse.json({ success: true, link, smsStatus }, { status: 200 });

    } catch (error) {
        console.error('Error generating invite:', error);
        return NextResponse.json(
            { error: 'Error generating invite' },
            { status: 500 }
        );
    }
}
