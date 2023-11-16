'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        {session?.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <button
        onClick={() =>
          signIn('azure-ad', { callbackUrl: '/' }, { prompt: 'login' })
        }
        style={{
          padding: '0',
          border: '0',
          boxShadow: '0',
        }}
      >
        <img src="https://learn.microsoft.com/en-us/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_signin_light.png" />
      </button>
    </>
  );
}
