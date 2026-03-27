import { jwtVerify } from "jose";
import { NextResponse,NextRequest } from "next/server";





const protectedRoutes= ['/analyze','/history', '/report']
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
    //get the token from the secure cookie we created during login 
    const token = request.cookies.get('access_token')?.value;
    const path = request.nextUrl.pathname;
    //define which paths we want to protect
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));

    //only verify token if we actually need to check access
    const needsCheck = isProtectedRoute || isAdminRoute || isAuthRoute;
    const payload = (token && needsCheck) ? await getTokenPayload(token) : null;
    const isValid = !!payload;
    const isAdmin = Boolean(payload?.is_staff); //catches true ,  or "true"

    //fake/expired token -> clear cookies and redirect to login 
    if(token && !isValid && needsCheck){
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        return response;
    }

    //protected route -> must be logged in 
    if(isProtectedRoute && !isValid){
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    //admin route -> must be admin
    if(isAdminRoute && !isAdmin){
        return NextResponse.redirect(new URL('/', request.url));
    }
    // admin goes to /admin, user goes to /
    if (isAuthRoute && isValid) {
        return NextResponse.redirect(
            new URL(isAdmin ? '/admin' : '/', request.url)
        );
    }
    return NextResponse.next();
    
    
    
}
// ✅ runs on everything except static files and API routes
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};