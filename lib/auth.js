import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.admin.findUnique({
          where: { username: credentials.username }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 365 * 24 * 60 * 60,
    updateAge: 0,
  },
  jwt: {
    maxAge: 365 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.username = token.username;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 365 * 24 * 60 * 60
      }
    }
  },
  events: {
    async signOut() {
      console.log('Admin manually signed out');
    }
  },
};

export default NextAuth(authOptions);
