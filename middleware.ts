import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = ['https://api.cloudinary.com']
 
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const path = request.url.split('/cld/')[1]
    const url = new URL(`https://api.cloudinary.com/${path}`)
    const headers = new Headers(request.headers)
    headers.append('Authorization', "Basic NTY1NjU3MTY4MTgyMTY2OmxMeEhGbnNUNjJRTTlVRkt6aWJRdGdGUGlwOA==");

    const response = await fetch(url, {
        headers: headers,
        method: request.method,
        body: request.body,
        redirect: 'follow',
    });
    
    return NextResponse.json(response);
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/cld/:path*',
}