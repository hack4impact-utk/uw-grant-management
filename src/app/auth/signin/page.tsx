'use client';
import { signIn } from 'next-auth/react';

/*
    This is a dummy sign in page. It's purpose is to be auto navigated to if the user is not logged in.
    If they are navigated here, it will call the next-auth signin function to sign them in through microsoft. 
    If the auth is disabled within the env file, this this page will never be visited.
*/
export default function SignInPage() {
  signIn('azure-ad', { callbackUrl: '/' }, { prompt: 'login' });

  return null;
}
