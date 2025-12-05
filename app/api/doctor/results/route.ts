import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import ResponseModel from '@/app/lib/models/Response';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/app/lib/auth.config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authConfig);

    if (!session || (session.user as any).role !== 'doctor') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }
    // Buscamos los últimos 20 resultados, ordenados por fecha (más nuevo primero)
    const results = await ResponseModel.find({})
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ success: false, error: 'Error al obtener datos' }, { status: 500 });
  }
}