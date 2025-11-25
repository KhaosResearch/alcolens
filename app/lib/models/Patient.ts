import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {},
  { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', patientSchema);
