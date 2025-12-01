import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  specialization?: string; 
  medicalLicense?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Por favor proporcione un nombre'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Por favor proporcione un correo electrónico'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor proporcione un correo electrónico válido',
      ],
    },
    role: {
      type: String,
      required: [true, 'Por favor proporcione un rol'],
      enum: ['doctor', 'patient'], // Example roles
    },
    password: {
      type: String,
      required: [true, 'Por favor proporcione una contraseña (Longitud mínima de 6 caracteres)'],
      minlength: 6,
      select: false,
    },
    specialization: {
      type: String,
      default: null,
    },
    medicalLicense: {
      type: String,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);

