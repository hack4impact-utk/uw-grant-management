import AzureADProvider from 'next-auth/providers/azure-ad';
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import { ADMIN_EMAILS } from '@/utils/constants/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) {
        throw new Error('No authenticated user email');
      }

      if (
        user?.email?.endsWith('@unitedwayknox.org') ||
        ADMIN_EMAILS.includes(user?.email?.toLowerCase())
      ) {
        return true;
      } else {
        throw new Error('Unauthorized');
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);
