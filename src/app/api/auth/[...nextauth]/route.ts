import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import EmailProvider from "next-auth/providers/email";
import nodemailer from "nodemailer";

// Reuse PrismaClient to prevent multiple instances
const prisma = new PrismaClient();

// Safely parse and normalize allowed admin emails
const ALLOWED_ADMIN_EMAILS = (process.env.ALLOWED_ADMIN_EMAILS || "")
  .split(",")
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);

// Create the auth handler
const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const normalizedEmail = email.trim().toLowerCase();
        if (
          !normalizedEmail.endsWith("@proserv.com") &&
          !ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)
        ) {
          throw new Error("Only @proserv.com email addresses or authorized admin emails are allowed");
        }

        const transporter = nodemailer.createTransport(provider.server);
        await transporter.sendMail({
          to: email,
          from: provider.from,
          subject: "Sign in to Proserv SSV Control Panel",
          text: `Sign in to Proserv SSV Control Panel\n${url}\n\n`,
          html: `
            <div style="font-family: Arial, sans-serif; text-align: center;">
              <h1>Proserv SSV Control Panel</h1>
              <p>Click the link below to sign in:</p>
              <p><a href="${url}" style="color: blue;">Sign in</a></p>
            </div>
          `,
        });
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const normalizedEmail = user.email.trim().toLowerCase();
        return (
          normalizedEmail.endsWith("@proserv.com") ||
          ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)
        );
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    }
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development' && process.env.DEBUG_AUTH === 'true',
});

// Export named handlers for each HTTP method
export { handler as GET, handler as POST };
