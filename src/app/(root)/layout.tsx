import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  return (
    <main className="root-container pattern min-h-screen">
      <Header session={session} />
      <div className="mt-10 pb-20">{children}</div>
    </main>
  );
};

export default Layout;
