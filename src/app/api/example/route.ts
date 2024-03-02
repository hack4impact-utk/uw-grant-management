import { NextRequest } from 'next/server';
import { apiMiddleware } from '../auth/[...nextauth]/apiMiddleware';
/* 
Two example endpoints using new api middleware.
*/
export async function GET(req: NextRequest) {
  console.log(req.cookies.get('next-auth.session-token'));
  console.log('STARTING GET REQUEST');

  return apiMiddleware(req);
}

export async function POST(req: NextRequest) {
  console.log(req.cookies.get('next-auth.session-token'));
  console.log('STARTING POST REQUEST');

  return apiMiddleware(req);
}
