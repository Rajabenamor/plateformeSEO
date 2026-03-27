import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function verifySession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
  

    //no cookie -> not logged in
    if(!token){
      return false;
    }
    try{
      //verify loally - no network request needed -> FASTER
     const secret = new TextEncoder().encode(process.env.DJANGO_SECRET_KEY);
     await jwtVerify(token,secret,{
      algorithms:["HS256"],
     });

    
    return true;//true if valis , false if expired or fake
    }catch(error){
       
      //if signature invalid or token expired, treat as not logged in 
      return false;
    }
  
  
}


export async function verifyAdminSession(){
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;


  //no cookie -> not logged in
  if(!token){
    return false;
  }

  try{
    //verify loally - no network request needed -> FASTER
    const secret = new TextEncoder().encode(process.env.DJANGO_SECRET_KEY);
    const {payload} = await jwtVerify(token,secret,{algorithms:["HS256"]});

    

    //django puts is_staff in the token payload
    return payload.is_staff === true; 
  }catch(error){
   
    //if signature invalid or token expired, treat as not logged in 
    return false;
  }
}