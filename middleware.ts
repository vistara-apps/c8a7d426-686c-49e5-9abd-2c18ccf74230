import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock authentication middleware - replace with real Farcaster auth in production
export function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes that don't need auth
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/api/maps') ||
    request.nextUrl.pathname === '/api/ws' ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    request.nextUrl.pathname.startsWith('/og-image')
  ) {
    return NextResponse.next();
  }

  // For demo purposes, we'll allow all requests
  // In production, implement proper Farcaster authentication here

  // Check for Farcaster auth headers (mock implementation)
  const farcasterId = request.headers.get('x-farcaster-id');
  const walletAddress = request.headers.get('x-wallet-address');

  if (!farcasterId || !walletAddress) {
    // For API routes that require authentication
    if (request.nextUrl.pathname.startsWith('/api/') &&
        !request.nextUrl.pathname.startsWith('/api/maps') &&
        request.nextUrl.pathname !== '/api/ws') {

      return NextResponse.json(
        {
          error: 'Authentication required',
          message: 'Please connect your Farcaster account and wallet'
        },
        { status: 401 }
      );
    }
  }

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();

    // Allow requests from Farcaster frames
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-farcaster-id, x-wallet-address');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/maps (public mapping endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/maps|_next/static|_next/image|favicon.ico).*)',
  ],
};

