import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

interface AuthToken {
  sub?: string;
  roles?: string[];
}

export async function requireAuth(req: NextRequest, roles?: string[]) {
  const token = await getToken({ req }) as AuthToken | null
  
  if (!token || !token.sub) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (roles && !roles.some(role => token.roles?.includes(role))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return token
} 