import { cookies } from "next/headers";
import * as jose from "jose";

export async function getAuthUser(){
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.DJANGO_SECRET_KEY);
            const { payload } = await jose.jwtVerify(token, secret);
            return {
                id: payload.user_id as number,
                isSuperAdmin: payload.role === "SUPER_ADMIN" || payload.is_superuser === true,
                username: payload.username as string,
            };
        } catch (error) {
        }
    }

    const userData = cookieStore.get("user_data")?.value;
    if (userData) {
        try {
            const user = JSON.parse(userData);
            return {
                id: user.id as number,
                isSuperAdmin: user.role === "SUPER_ADMIN" || user.is_superuser === true,
                username: user.username as string,
            };
        } catch {
            return null;
        }
    }

    return null;
}