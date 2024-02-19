import { signIn, useSession } from 'next-auth/react';

/*
This function will get the current session and redirect the user to login if there is no session.
The signIn function will redirect the user to sign in via Microsoft.
If the env var is set to disable auth, then the signIn function will not be called.
*/
export function useRequireAuth() {
  const { data: session } = useSession();

  if (!session && process.env.NEXT_PUBLIC_DISABLE_AUTH === 'false') {
    handleLogin();
    return;
  }

  return session;
}

/* 
Redirect to sign in via Microsoft
Only callable client side
*/
export async function handleLogin() {
  await signIn('azure-ad', { callbackUrl: '/' }, { prompt: 'login' });
}
