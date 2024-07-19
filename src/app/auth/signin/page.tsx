'use client';
import { useEffect } from 'react';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  useEffect(() => {
    signIn('azure-ad', { callbackUrl: '/' }, { prompt: 'login' });
  }, []);

  return null;
}
