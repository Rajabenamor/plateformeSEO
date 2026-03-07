import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export function middleware(request:NextRequest){
    //get the token from the secure cookie we created during login 
    const token = request.cookies.get('access_token')?.value;
    //define which paths we want to protect
    const isHomePage = request.nextUrl.pathname.startsWith('/');
    //if they are trying to access the home page without a token , kick them to login
    if(isHomePage && !token){
        return NextResponse.redirect(new URL('/login', request.url));
    }
    //if they are logged in and try to go to the login/register page , send them to dashboard
    const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'; 
    if(isAuthPage && token){
        return NextResponse.redirect(new URL('/',request.url));
    }
    return NextResponse.next();
}
//this tells next.js to only run this code for specific pages
export const config={
    matcher: ['/','/login','/register'],
};