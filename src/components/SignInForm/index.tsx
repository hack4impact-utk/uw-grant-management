'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
  const router = useRouter();

  async function onClick() {
    signIn('azure-ad', { callbackUrl: '/' }, { prompt: 'login' });
    router.push('/protected');
  }

  return (
    <>
      <button onClick={onClick}>
        <img src="https://learn.microsoft.com/en-us/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_signin_light.png" />
      </button>
    </>
  );
}
