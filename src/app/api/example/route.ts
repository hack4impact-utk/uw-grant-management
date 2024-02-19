import { Session, getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import authOptions from '../auth/[...nextauth]/config';

/* 
These are two sample requests that can be made to the server. (endpoint: api/example)
In order for either of these to work, you need to be logged in. 
It will check the current session using the getServerSession function from next-auth.
What it is checking for is the next-auth.session-token.
*/
export async function GET(req: NextRequest) {
  console.log(req.cookies.get('next-auth.session-token'));
  console.log('STARTING GET REQUEST');

  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    console.log('Unauthorized');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  console.log('Authorized', session?.user?.name);
  return NextResponse.json({ message: session?.user?.name }, { status: 200 });
}

export async function POST(req: NextRequest) {
  console.log(req.cookies.get('next-auth.session-token'));
  console.log('STARTING POST REQUEST');

  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    console.log('Unauthorized');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  console.log('Authorized', session?.user?.name);
  return NextResponse.json({ message: session?.user?.name }, { status: 200 });
}
