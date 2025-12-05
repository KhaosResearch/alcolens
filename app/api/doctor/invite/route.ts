import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/lib/auth.config";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { doctorName, email, id } = body;
        const session = await getServerSession(authConfig);


        if (!doctorName || !email) {
            return NextResponse.json(
                { error: 'Faltan campos obligatorios' },
                { status: 400 }
            );
        }
        if ((session?.user as any)?.role !== 'doctor') {
            return NextResponse.json(
                { error: 'Solo los médicos pueden enviar invitaciones' },
                { status: 404 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Configuración del Email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Remitente (debe ser el mismo que auth.user)
            to: email, // Destinatario solicitado
            replyTo: email, // Para responder directamente al usuario
            subject: `[Alcolens Invitación] Análisis de alcohol`,
            text: `Nuevo mensaje de contacto:`,
            html: `
        <div style="background-color: #f8fafc; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <!-- Cabecera Roja -->
            <div style="background-color: #CD4242; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">AlcoLens</h1>
            </div>

            <!-- Contenido -->
            <div style="padding: 40px 30px; color: #334155;">
            <h2 style="color: #1e293b; font-size: 20px; margin-top: 0;">Invitación a Evaluación de Salud</h2>
            
            <p style="line-height: 1.6; font-size: 16px;">Estimado/a paciente,</p>
            
            <p style="line-height: 1.6; font-size: 16px;">
                Como parte de su seguimiento médico, le invitamos a completar una breve evaluación de salud hepática. Este proceso es <strong>totalmente confidencial</strong> y nos ayuda a mejorar la calidad de su atención.
            </p>

            <div style="background-color: #f1f5f9; border-left: 4px solid #CD4242; padding: 15px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #475569;">
                <strong>⏱ Tiempo estimado:</strong> 2 minutos<br>
                <strong>🔒 Privacidad:</strong> Sus respuestas son anónimas y seguras.
                </p>
            </div>

            <p style="line-height: 1.6; font-size: 16px;">
                Atentamente,
                <br />
                ${doctorName}
            </p>

            <!-- Botón CTA -->
            <div style="text-align: center; margin-top: 35px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/patient/audit?id=${id}" style="background-color: #CD4242; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(205, 66, 66, 0.3);">
                Comenzar Evaluación
                </a>
            </div>

            <p style="margin-top: 40px; font-size: 13px; color: #94a3b8; text-align: center;">
                Si el botón no funciona, copie y pegue este enlace en su navegador: <br>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/patient/audit?id=${id}" style="color: #CD4242;">${process.env.NEXT_PUBLIC_APP_URL}/patient/audit?id=${id}</a>
            </p>
        </div>

        <!--Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 12px; color: #64748b; margin: 0;">
                © 2025 Servicio Médico AlcoLens.Todos los derechos reservados.<br>
                Este es un mensaje automático, por favor no responda a este correo.
            </p>
        </div>
        </div>
        </div>
            `};

        // Enviar Email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Error enviando email:', error);
        return NextResponse.json(
            { error: 'Error al enviar el mensaje. Verifique la configuración SMTP.' },
            { status: 500 }
        );
    }
}
