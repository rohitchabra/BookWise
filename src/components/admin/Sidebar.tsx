"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { logout } from "@/lib/actions/auth";

const adminLinks = [
  { href: "/admin", label: "Home", icon: "/icons/admin/home.svg" },
  { href: "/admin/users", label: "All Users", icon: "/icons/admin/users.svg" },
  { href: "/admin/books", label: "All Books", icon: "/icons/admin/book.svg" },
  {
    href: "/admin/borrow-records",
    label: "Borrow Requests",
    icon: "/icons/admin/bookmark.svg",
  },
  {
    href: "/admin/account-requests",
    label: "Account Requests",
    icon: "/icons/admin/user.svg",
  },
];

const Sidebar = ({
  user,
}: {
  user: { name?: string | null; email?: string | null };
}) => {
  const pathname = usePathname();

  return (
    <aside className="sticky left-0 top-0 flex h-dvh w-full max-w-[260px] flex-col justify-between bg-white px-5 pb-8 pt-10">
      <div>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icons/logo.svg" alt="logo" height={37} width={37} />
          <span className="text-xl font-semibold text-blue">BookWise</span>
        </Link>

        <nav className="mt-10 flex flex-col gap-2">
          {adminLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-blue text-white"
                    : "text-dark-200 hover:bg-light-300",
                )}
              >
                <Image
                  src={link.icon}
                  alt={link.label}
                  width={20}
                  height={20}
                  className={cn(isActive && "brightness-0 invert")}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center justify-between gap-2 rounded-xl bg-light-300 px-3 py-3">
        <div className="flex items-center gap-2">
          <Avatar fallback={getInitials(user.name || "A")} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-dark-200">
              {user.name}
            </p>
            <p className="truncate text-xs text-light-500">{user.email}</p>
          </div>
        </div>
        <form action={logout}>
          <button type="submit" title="Logout">
            <Image
              src="/icons/logout.svg"
              alt="logout"
              width={20}
              height={20}
            />
          </button>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;
