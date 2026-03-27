import { cookies } from "next/headers";
import * as jose from "jose";

export async function getAuthUser(){
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if(!token) return null;
    try{
        //verify the token actually came from the backend
        const secret = new TextEncoder().encode(process.env.DJANGO_SECRET_KEY);
        const {payload} = await jose.jwtVerify(token,secret);
        return{
            id:payload.user_id as number,
            isSuperAdmin: payload.role ==="SUPER_ADMIN" || payload.is_superuser === true,
        }
    
    }catch(error){
        //if token is expired or tampered with , jwtverify throws an error
        return null;
    }
}