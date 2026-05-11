import { logoutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export default function LogoutButton(){
    return(
        <form action={logoutAction}>
            <button
            type="submit"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider cursor-pointer"
            >
                <LogOut size={16}/>
                Log Out
            </button>
        </form>
    );
}
