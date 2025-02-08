import { NextRequest } from 'next/server';

const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function checkRateLimit(
  req: NextRequest,
  key: string,
  limit: number,
  windowMs: number = 60000 // 1 minute default
): Promise<boolean> {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const identifier = `${ip}:${key}`;
  const now = Date.now();

  const current = rateLimit.get(identifier);

  if (!current) {
    rateLimit.set(identifier, { count: 1, timestamp: now });
    return false;
  }

  if (now - current.timestamp > windowMs) {
    rateLimit.set(identifier, { count: 1, timestamp: now });
    return false;
  }

  if (current.count >= limit) {
    return true;
  }

  current.count++;
  return false;
}

export default { checkRateLimit }; 