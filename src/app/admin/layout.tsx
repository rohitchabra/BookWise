import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <main className="flex min-h-screen w-full flex-row bg-admin">
      <Sidebar user={session.user} />
      <div className="admin-container m-5 ml-0 w-full">{children}</div>
    </main>
  );
};

export default AdminLayout;
