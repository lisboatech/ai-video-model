import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Redirecionar rotas antigas para as novas
  if (pathname.startsWith('/workspace/mothers-day')) {
    const newPath = pathname.replace('/workspace/mothers-day', '/workspace');
    return NextResponse.redirect(new URL(newPath, request.url));
  }
}

export const config = {
  matcher: ['/workspace/mothers-day/:path*'],
};

