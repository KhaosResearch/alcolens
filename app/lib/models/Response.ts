import mongoose, { Schema, Document } from 'mongoose';

// 1. INTERFACE: Debe tener TODOS los campos que guardas
export interface IResponse extends Document {
  patientId: string; // Lo ponemos String para aceptar UUIDs o ObjectIds
  sex: 'man' | 'woman';
  studyLevel: string;
  // Usamos Map o Record para definir que es un objeto { "q1": 0, "q2": 1 }
  answers: Map<string, number>;
  totalScore: number;
  levelResult: string;
  consent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const responseSchema = new mongoose.Schema<IResponse>(
  {
    patientId: {
      type: String,
      required: true,
      index: true
    },
    sex: {
      type: String,
      required: true,
      enum: ['man', 'woman']
    },
    studyLevel: {
      type: String,
      required: true
    },
    answers: {
      type: Map,
      of: Number,
      required: true
    },
    totalScore: {
      type: Number,
      required: true
    },
    levelResult: {
      type: String,
      required: true
    },
    consent: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Response || mongoose.model<IResponse>('Response', responseSchema);