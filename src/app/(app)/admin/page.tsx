import { redirect } from "next/navigation";
import { getUsersAction } from "@/app/actions/admin";
import { verifyAdminSession } from "@/lib/session";
import { getAuthUser } from "@/lib/auth-utils";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export default async function AdminPage() {
    // 1. Secure Server-Side checks
    const isAdmin = await verifyAdminSession();
    if(!isAdmin){
        redirect('/');
    }
    
    // 2. Fetch the data
    const currentUser = await getAuthUser();
    const result = await getUsersAction();

    // 3. Pass data down to the Client Tab Controller
    return <AdminDashboardClient result={result} currentUser={currentUser} />;
}