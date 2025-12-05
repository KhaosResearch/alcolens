import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import User from '@/app/lib/models/User';
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { token, password } = await request.json();

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return NextResponse.json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return NextResponse.json({ error: 'Error al restablecer la contraseña' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { token } = await request.json();
        const user = await User.findOne({ resetPasswordToken: token });
        if (!user) {
            return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
        }
        const result = await user.resetPassword(token);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return NextResponse.json({ error: 'Error al restablecer la contraseña' }, { status: 500 });
    }
}
