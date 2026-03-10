import { logoutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export default function LogoutButton(){
    return(
        <form action={logoutAction}>
            <button
            type="submit"
            className="flex items-center gap-2 text-red-600 hover:text-red-800 transition p-2 font-medium"
            >
                <LogOut size={20}/>
                Log Out

            </button>
        </form>
    );
}