import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { json } from 'stream/consumers'

// const allowedOrigins = ['https://api.cloudinary.com']

// const corsOptions = {
//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// }

// Simple in-memory cache
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute cache

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const path = request.url.split('/cld/')[1]
    const url = `https://api.cloudinary.com/${path}`

    // Use method + url as cache key
    const cacheKey = `${request.method}:${url}`;
    const now = Date.now();

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && (now - cached.timestamp < CACHE_TTL)) {
        console.log("middleware, use cache ...");
        return NextResponse.json(cached.data);
    }

    const headers = new Headers();
    headers.set('Authorization', "Basic NTY1NjU3MTY4MTgyMTY2OmxMeEhGbnNUNjJRTTlVRkt6aWJRdGdGUGlwOA==");
    headers.set("Content-Type", "application/json");

    console.log("middleware, fetch server ...");
    const response = await fetch(url, {
        headers: headers,
        method: request.method,
        body: request.body,
        redirect: 'follow',
    });

    const data = await response.json();

    const rateLimitRemaining = response.headers.get('X-FeatureRateLimit-Remaining');
    console.log('X-FeatureRateLimit-Remaining:', rateLimitRemaining);

    // Save to cache
    cache.set(cacheKey, { data, timestamp: now });

    return NextResponse.json(data);

    // // Check the origin from the request
    // const origin = request.headers.get('origin') ?? ''
    // const isAllowedOrigin = allowedOrigins.includes(origin)

    // // Handle preflighted requests
    // const isPreflight = request.method === 'OPTIONS'

    // if (isPreflight) {
    //     const preflightHeaders = {
    //         ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
    //         ...corsOptions,
    //     }
    //     return NextResponse.json(response, { headers: preflightHeaders })
    // }

    // // Handle simple requests
    // const nextRresponse = NextResponse.json(response).next()

    // if (isAllowedOrigin) {
    //     nextRresponse.headers.set('Access-Control-Allow-Origin', origin)
    // }

    // Object.entries(corsOptions).forEach(([key, value]) => {
    //     response.headers.set(key, value)
    // })

    // return nextRresponse;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/cld/:path*',
}