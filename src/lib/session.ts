import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function getTokenPayload(token: string) {
    try {
        const secret = new TextEncoder().encode(process.env.DJANGO_SECRET_KEY);
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function verifySession() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    const payload = accessToken ? await getTokenPayload(accessToken) : null;
    if (payload) return true;

    if (refreshToken) return true;

    return false;
}

export async function verifyAdminSession() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    const payload = accessToken ? await getTokenPayload(accessToken) : null;
    
    if (payload) {
        return payload.is_staff === true;
    }

    if (refreshToken) {
        const userData = cookieStore.get('user_data')?.value;
        if (userData) {
            try {
                const user = JSON.parse(userData);
                return user.is_staff === true;
            } catch {
                return false;
            }
        }
        return false;
    }

    return false;
}
