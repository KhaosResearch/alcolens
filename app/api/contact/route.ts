import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Faltan campos obligatorios' },
                { status: 400 }
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
            to: 'alcolenscontact@gmail.com', // Destinatario solicitado
            replyTo: email, // Para responder directamente al usuario
            subject: `[Alcolens Contacto] ${subject || 'Nuevo Mensaje'}`,
            text: `
        Nuevo mensaje de contacto:
        
        Nombre: ${name}
        Email: ${email}
        Asunto: ${subject}
        
        Mensaje:
        ${message}
      `,
            html: `
        <h3>Nuevo mensaje de contacto en Alcolens</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <br/>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
        };

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
