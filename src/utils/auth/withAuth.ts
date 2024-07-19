import { NextRequest, NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { apiMiddleware } from './apiMiddleware';

interface AuthCheckResponse {
  status: number;
  body?: any;
  session?: Session;
}

type Handler = (req: NextRequest, params?: any) => Promise<NextResponse>;

export function withAuth(handler: Handler) {
  return async (req: NextRequest, params: any) => {
    const authCheck: AuthCheckResponse = await apiMiddleware(req);

    if (authCheck.status !== 200) {
      return NextResponse.json(authCheck.body, { status: authCheck.status });
    }

    return handler(req, params);
  };
}
