import mongoose, { Schema, Document } from 'mongoose';

export interface IResponse extends Document {
  patientId: mongoose.Types.ObjectId;
  questionnaireId?: string;
  answers: any;
  createdAt: Date;
}

const responseSchema = new Schema<IResponse>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    questionnaireId: { type: String },
    answers: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Response || mongoose.model<IResponse>('Response', responseSchema);
