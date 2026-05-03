
import { redirect } from "next/navigation";
import { getUsersAction } from "@/app/actions/admin";
import AdminTable from "@/components/AdminTable";
import AdminError from "@/components/AdminError";
import { verifyAdminSession } from "@/lib/session";
import { getAuthUser } from "@/lib/auth-utils";

export default async function AdminPage(){
    const isAdmin = await verifyAdminSession();
    if(!isAdmin){
        redirect('/');
    }
    const currentUser = await getAuthUser();

    const result = await getUsersAction();
    if(!result.success) {
        return <AdminError error={result.error || ""} />;
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