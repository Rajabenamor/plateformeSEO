
import { redirect } from "next/navigation";
import { getUsersAction } from "../actions/auth";
import AdminTable from "@/components/AdminTable";
import { verifyAdminSession } from "@/lib/session";
import { getAuthUser } from "@/lib/auth-utils";



export default async function AdminPage(){
    //verify admin on server before rendering anything
    const isAdmin = await verifyAdminSession();
    if(!isAdmin){
        redirect('/');
    }
    //get detailed user info to check for "super admin" status
        const currentUser = await getAuthUser();

    const result = await getUsersAction();
    if(!result.success) {
        return(<div className="p-8 text-center text-red-500">Failed to load users</div>

        );
    }
    return(
        <div className="max-w-6xl mx-auto p-8 transition-colors">
            <h1 className="text-2xl font-bold text-primary mb-2">Admin Dashboard</h1>
            <p className="text-sm text-foreground/60 mb-6">{result.count} total users</p>
            <AdminTable initialUsers={result.users}
            isSuperAdmin={!!currentUser?.isSuperAdmin}
            currentUserId={currentUser?.id}
            />

        </div>
    );
}