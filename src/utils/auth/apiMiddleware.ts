import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/config';

/*
  Custom API middleware to check if a user is authenticated.
  Can be called within each endpoint.
  If the auth is disabled in the env file, then it will return a 200 status code with a message.
*/
export async function apiMiddleware(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
    return NextResponse.json({ message: 'AuthDisabled' }, { status: 200 });
  }

  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next(); // Proceed to the API route handler
}
