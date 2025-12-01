import mongoose, { Schema, Document } from 'mongoose';

export interface IInviteToken extends Document {
  patientId: mongoose.Types.ObjectId;
  tokenHash: string;
  createdBy: mongoose.Types.ObjectId; // doctor id
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const inviteTokenSchema = new Schema<IInviteToken>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    tokenHash: { type: String, required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.InviteToken || mongoose.model<IInviteToken>('InviteToken', inviteTokenSchema);
