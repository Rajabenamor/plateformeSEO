"use client"
import { BarChart } from "lucide-react";


export default function ConnectAnalyticsButton(){
    const handleConnect=()=>{
        //this URL tells google exactly what your app wants to do
        const clientId = "134264669287-qr8f416jdiooud2c4o6ej1asbo1l6g52.apps.googleusercontent.com"
        const redirectUri="http://localhost:3000/api/auth/google/callback"
        const scope="https://www.googleapis.com/auth/analytics.readonly"
        const googleAuthUrl=`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`

        //send the user to google 
        window.location.href=googleAuthUrl;

    };

    return(
        <button
            onClick={handleConnect}
            className="flex items-center gap-2 bg-white  border border-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors font-bold shadow-sm"
            
        >
            <BarChart size={18 } className="text-[#15418c]" />
            Connect Google Analytics
        </button>
    )
}