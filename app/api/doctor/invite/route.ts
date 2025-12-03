import { NextRequest, NextResponse } from 'next/server';
import Link from 'next/link';
import { callBackUrl } from '@/app/lib/utils/urls';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nih, phone } = body;
        const link = `https://alcolens.vercel.app/patient/audit?id=${nih}`;

        if (phone) {
            try {
                const jasminURL = process.env.NEXT_PUBLIC_JASMINURL;
                const jasminUser = process.env.NEXT_PUBLIC_JASMINUSER;
                const jasminPassword = process.env.NEXT_PUBLIC_JASMINPASSWORD;
                const jasminFrom = process.env.NEXT_PUBLIC_JASMINFROM;
                const JasminAuth = Buffer.from(`${jasminUser}:${jasminPassword}`).toString('base64');
                const JasminHeaders = {
                    'Authorization': `Basic ${JasminAuth}`,
                    'Content-Type': 'application/json'
                };
                const JasminBody = {
                    'to': phone.startsWith('+') ? phone : `+34${phone.replace(/\s/g, '')}`,
                    'from': jasminFrom,
                    'content': `Hola, le invitamos a realizar su evaluación de salud en Alcolens: ${link}`,
                    'drl': "yes",
                    'drl-url': callBackUrl,
                    'drl-level': 3
                };

                const JasminResponse = await fetch(`${jasminURL}/messages`, {
                    method: 'POST',
                    headers: JasminHeaders,
                    body: JSON.stringify(JasminBody)
                });

                if (JasminResponse.ok) {
                    return NextResponse.json({ success: true, link, smsStatus: 'sent' }, { status: 200 });
                } else {
                    return NextResponse.json({ success: true, link, smsStatus: 'failed' }, { status: 200 });
                }
            } catch (error) {
                console.error('Error sending SMS:', error);
                return NextResponse.json({ success: true, link, smsStatus: 'failed' }, { status: 200 });
            }
        } else {
            return NextResponse.json({ error: 'Número de teléfono requerido' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error generating invite:', error);
        return NextResponse.json(
            { error: 'Error generating invite' },
            { status: 500 }
        );
    }
}
