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
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/login/password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const message = `
            <h1>Has solicitado restablecer tu contraseña</h1>
            <p>Por favor, ve a este enlace para restablecer tu contraseña:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
            <p>Este enlace expirará en 1 hora.</p>
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
