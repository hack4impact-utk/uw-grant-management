import AzureADProvider from 'next-auth/providers/azure-ad';
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  // Defines the providers to use for authentication. All of the client secret values are stored in the .env file.
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

      if (user?.email?.endsWith('@vols.utk.edu')) {
        // If the user's email ends with '@vols.utk.edu', they are allowed to sign in.
        // Can be used to restrict access to only members of an organization.
        return true;
      } else {
        // If the user's email doesn't match the criteria, they are not allowed to sign in.
        throw new Error('Unauthorized');
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
