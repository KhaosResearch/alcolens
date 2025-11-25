// app/lib/auth.config.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from './db';
import User from './models/User';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // 1) validar entrada
        if (!credentials?.email || !credentials?.password) return null;

        // 2) conectar DB (usa tu util connectDB)
        await connectDB();

        // 3) buscar usuario
        const user = await User.findOne({ email: credentials.email }).select('+password');
        if (!user) return null;

        // 4) comparar contraseña (user.comparePassword debería existir)
        const match = await (user as any).comparePassword(credentials.password);
        if (!match) return null;

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

const handler = NextAuth(authConfig);
export const GET = handler.GET;
export const POST = handler.POST;
export const auth = handler;