import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import ResponseModel from '@/app/lib/models/Response'; // Asegúrate que la ruta al modelo nuevo es correcta
// import crypto from 'crypto';                 <-- Lo usaremos en el Sprint de Seguridad
// import InviteToken from '@/app/lib/models/InviteToken';

export async function POST(req: NextRequest) {
  try {
    // 1. Conexión a Base de Datos (Esperamos a que conecte 🛑)
    await connectDB();
    
    // 2. Leemos los datos que llegan del Frontend
    const body = await req.json();
    
    // Desestructuramos los datos NUEVOS que definiste en tu modelo
    const { 
      patientId, 
      sex, 
      studyLevel, 
      answers, 
      totalScore, 
      levelResult,
      token // Opcional por ahora
    } = body;

    // 3. VALIDACIÓN DE DATOS (Protección básica)
    if (!patientId || !answers || !sex || !studyLevel) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (patientId, sex, studyLevel o answers)' }, 
        { status: 400 }
      );
    }

    /* ---------------------------------------------------------------------------
    🚧 ZONA DE SEGURIDAD (TOKEN) - SPRINT 3
    Descomentar esto cuando integremos el sistema de citas/SMS.
    Por ahora, permitimos guardar sin token para el modo "Acceso QR / Anónimo".
    ---------------------------------------------------------------------------
    
    if (token) {
       const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
       const invite = await InviteToken.findOne({ tokenHash });
       
       if (!invite) return NextResponse.json({ error: 'Token inválido' }, { status: 404 });
       if (invite.used) return NextResponse.json({ error: 'Token ya usado' }, { status: 410 });
       
       // Marcar como usado
       invite.used = true;
       await invite.save();
    }
    */

    // 4. GUARDADO EN MONGOOSE (Usando tu nuevo Schema)
    // El 'await' aquí es CRÍTICO para asegurar que se escribe en disco
    const savedResponse = await ResponseModel.create({
      patientId,
      sex,
      studyLevel,
      answers,      // Mongoose convertirá automáticamente el objeto JSON a Map
      totalScore,
      levelResult,
      // Si quisieras guardar fecha manual: createdAt: new Date() (pero timestamps: true ya lo hace)
    });

    console.log(`✅ Resultado guardado. ID: ${savedResponse._id} | Riesgo: ${levelResult}`);

    // 5. Respuesta al cliente
    return NextResponse.json({ 
      success: true, 
      responseId: savedResponse._id.toString() 
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Error en API /audit/save:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}