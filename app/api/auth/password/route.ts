import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import User from '@/app/lib/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            // Security: Don't reveal if user exists
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.'
            });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token (optional but recommended) or store as is. 
        // For simplicity here, storing as is, but in production consider hashing.
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/login/password/reset?resetToken=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const message = `
        <div style="background-color: #f8fafc; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <!-- Cabecera Roja -->
            <div style="background-color: #CD4242; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">AlcoLens</h1>
            </div>

            <!-- Contenido -->
            <div style="padding: 40px 30px; color: #334155;">
            <h2 style="color: #1e293b; font-size: 20px; margin-top: 0;">Restablecimiento de Contraseña</h2>
            
            <p style="line-height: 1.6; font-size: 16px;">Por favor, haz clic en el botón de abajo para restablecer tu contraseña :</p>

             <!-- Botón CTA -->
            <div style="text-align: center; margin-top: 35px;">
                <a href="${resetUrl}" style="background-color: #CD4242; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(205, 66, 66, 0.3);">
                Restablecer Contraseña
                </a>
            </div>

             <p style="margin-top: 40px; font-size: 13px; color: #94a3b8; text-align: center;">
                Si el botón no funciona, copie y pegue este enlace en su navegador: <br>
                <a href="${resetUrl}" style="color: #CD4242;">${resetUrl}</a>
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
        `;

        try {
            await transporter.sendMail({
                to: user.email,
                from: process.env.EMAIL_USER,
                subject: 'Restablecimiento de Contraseña - Alcolens',
                html: message,
            });

            return NextResponse.json({
                success: true,
                message: 'Email Sent'
            });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            return NextResponse.json(
                { success: false, message: 'Email could not be sent' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
