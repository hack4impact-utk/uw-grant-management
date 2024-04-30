import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import authOptions from './config';

/*
    Custom api middleware to check if a user is authenticated.
    Can be called within each endpoint.
    If the auth is disabled in the env file, then it will return a 200 status code with a message.
*/
export async function apiMiddleware(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
    return NextResponse.json({ message: 'AuthDisabled' }, { status: 200 });
  }

  const session = await getServerSession(authOptions);
  // This is the token that is stored in cookies. If wanting to test api endpoints with postman, will have to include this in your request.
  console.log(req.cookies.get('next-auth.session-token'));

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Authorized' }, { status: 200 });
}
