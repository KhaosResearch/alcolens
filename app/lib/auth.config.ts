// app/lib/auth.config.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from './db';
import User from './models/User';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log("🔐 Authorize called with:", credentials?.email);
        // 1) validar entrada
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        // 2) conectar DB (usa tu util connectDB)
        try {
          await connectDB();
          console.log("✅ DB Connected");
        } catch (e) {
          console.error("❌ DB Connection failed:", e);
          return null;
        }

        // 3) buscar usuario
        const user = await User.findOne({ email: credentials.email }).select('+password');
        if (!user) {
          console.log("❌ User not found:", credentials.email);
          return null;
        }
        console.log("✅ User found:", user.email, "Role:", (user as any).role);

        // 4) comparar contraseña (user.comparePassword debería existir)
        const match = await (user as any).comparePassword(credentials.password);
        if (!match) {
          console.log("❌ Password mismatch");
          return null;
        }
        console.log("✅ Password match");

        // 5) devolver objeto de usuario público que NextAuth almacenará en el token
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: (user as any).role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
};

