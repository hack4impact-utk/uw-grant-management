// import { redirect } from 'next/navigation';
// import { getServerSession } from 'next-auth';

export default async function ProtectedRoute() {
  return (
    <div>
      This is a protected route.
      <br />
      You will only see this if you are authenticated.
    </div>
  );
}
