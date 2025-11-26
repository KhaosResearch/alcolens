import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import ResponseModel from '@/app/lib/models/Response'; // Tu modelo de datos
// import { getServerSession }... (Aquí añadirías seguridad para que solo el médico acceda)

export const dynamic = 'force-dynamic'; // Para que no cachee y siempre traiga datos frescos

export async function GET() {
  try {
    await connectDB();

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