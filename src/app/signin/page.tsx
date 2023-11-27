import SignInForm from '@/components/SignInForm';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/config';
import SignOutForm from '@/components/SignOutForm';

export default async function SignIn() {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <>
        <h1>Hi, you are logged in</h1>
        <SignOutForm />
      </>
    );
  }

  return (
    <>
      <h1>Hi, please sign in </h1>
      <SignInForm />
    </>
  );
}
