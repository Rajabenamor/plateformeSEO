"use server";
import { cookies } from "next/headers";
import { LoginFormData, RegisterFormData } from "../types/auth";
 // tells next.js this code MUST run securely on the server , not in the browser
 export async function registerServerAction(data : RegisterFormData){
    try{
        const response = await fetch("http://localhost:8000/api/auth/register/",{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body: JSON.stringify({
              username:data.username,
              email: data.email,
              password:data.password,
            }),
        
        });
        if(!response.ok){
            const errorData = await response.json()
            //returns the exact error from django 
            return {success : false , error:Object.values(errorData)[0]}; 
            // success:false => the login/register failed, do not redirect them to the profile page
            // error:Object.values(errorData)[0] => takes the first item of the array leaving keys like username ect
        }
        return{success: true};

    }catch(error){
        return {success : false , error: "Failed to connect to the server."};
    }
 }
 export async function loginServerAction(data:LoginFormData){
    try{
    const response = await fetch("http://localhost:8000/api/auth/login/",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({
          username:data.username,
          password:data.password,
        }),
    });
    const result = await response.json();
    if(!response.ok){
        //returns the exact error from django 
        return {success : false , error: result.detail || "Invalid credentials"}; 
        
    }
//store the jwt in an HTTpOnly cookie
//this makes the token invisible to client-side JavaScript
const cookieStore = await cookies();
cookieStore.set("access_token",result.access, {
    httpOnly: true,
    secure:process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    path : "/",
});
return{success:true};

}catch(error){
    return {success : false , error: "Connection Failed"};
}
 };

 //logout

 export async function logoutAction(){
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
 }