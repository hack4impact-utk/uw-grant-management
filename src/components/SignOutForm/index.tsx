'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOutForm() {
  const { data: session } = useSession();
  const router = useRouter();

  async function onClick() {
    signOut();
    router.push('/signin');
  }

  return (
    <>
      {session?.user?.name} <br />
      <button onClick={onClick}>Sign out</button>
    </>
  );
}
