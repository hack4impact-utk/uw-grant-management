import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

// Custom hook to require authentication -- can be used anywhere **client side**
export function useRequireAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      if (
        !process.env.NEXT_PUBLIC_DISABLE_AUTH ||
        process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'true'
      ) {
        handleLogin();
      }
    }
  }, [session, status]);

  if (
    process.env.NEXT_PUBLIC_DISABLE_AUTH &&
    process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'
  ) {
    return {
      user: {
        name: 'Test User',
        email: 'email@gmail.com',
        image: null,
      },
      expires: '2022-12-31T23:59:59Z',
    };
  }
  return session;
}

// Redirect to sign in via Microsoft
export async function handleLogin() {
  await signIn('azure-ad', { callbackUrl: '/' }, { prompt: 'login' });
}
