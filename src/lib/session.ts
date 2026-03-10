import { cookies } from "next/headers";


export async function verifySession() {
    const cookieStore = await cookies();

  //check if the token exists
  const hasToken=cookieStore.has('access_token');
  return hasToken;
}