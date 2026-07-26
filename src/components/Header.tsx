"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icons/logo.svg" alt="BookWise" width={40} height={40} />
        <span className="hidden font-semibold text-white xs:inline">
          BookWise
        </span>
      </Link>

      <ul className="flex flex-row items-center gap-6 sm:gap-8">
        <li>
          <Link
            href="/"
            className={cn(
              "text-base capitalize transition",
              pathname === "/" ? "text-light-200" : "text-light-100 hover:text-white",
            )}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/search"
            className={cn(
              "text-base capitalize transition",
              pathname.startsWith("/search")
                ? "text-light-200"
                : "text-light-100 hover:text-white",
            )}
          >
            Search
          </Link>
        </li>
        {session?.user?.role === "ADMIN" && (
          <li>
            <Link
              href="/admin"
              className="text-base capitalize text-primary transition hover:text-primary-light"
            >
              Admin
            </Link>
          </li>
        )}
        <li>
          <Link href="/my-profile">
            <Avatar fallback={getInitials(session?.user?.name || "U")} />
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
