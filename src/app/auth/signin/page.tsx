'use client';
import { useRequireAuth } from '@/utils/auth/auth-sign-in';
import { redirect } from 'next/navigation';

// The only purpose of this page is to call useRequireAuth and redirect if already signed in
// This is needed because the useRequireAuth function can only be called client side
const SignIn = () => {
  const session = useRequireAuth();
  if (session) {
    redirect('/');
  }

  return null;
};
export default SignIn;
