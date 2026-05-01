import { jwtVerify } from "jose";
import { NextResponse,NextRequest } from "next/server";





const protectedRoutes= ['/analyze','/history', '/report', '/dashboard', '/admin']
const adminRoutes=['/admin']
const authRoutes=['/auth/login', '/auth/register']

async function getTokenPayload(token: string) {
    try {
        const secretkey = process.env.DJANGO_SECRET_KEY;
        if(!secretkey){
            console.error("Middleware error : DJANGO_SECRET_KEY is missing!");
            return null;
        }
        const secret = new TextEncoder().encode(process.env.DJANGO_SECRET_KEY);
       
        const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
        return payload;
    } catch(error) {
        return null;
    }
}

export async function middleware(request:NextRequest){
    //get tokens from cookies
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;
    const path = request.nextUrl.pathname;

    //define which paths we want to protect
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));

    // verify access token
    const payload = (accessToken) ? await getTokenPayload(accessToken) : null;
    const isValid = !!payload;
    const isAdmin = Boolean(payload?.is_staff);

    // 1. If trying to access a protected route
    if (isProtectedRoute || isAdminRoute) {
        // If we have NO tokens at all, redirect to login
        if (!accessToken && !refreshToken) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // If access token is invalid but we have a refresh token, let it pass
        // The Page or Server Action (via secureFetch) will handle the refresh.
        if (!isValid && refreshToken) {
            return NextResponse.next();
        }

        // If it's an admin route but the user is not an admin, redirect home
        if (isAdminRoute && !isAdmin) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 2. If on an auth route (login/register) and already validly logged in, redirect away
    if (isAuthRoute && isValid) {
        return NextResponse.redirect(
            new URL(isAdmin ? '/admin' : '/dashboard', request.url)
        );
    }

    return NextResponse.next();
}
// ✅ runs on everything except static files and API routes
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};