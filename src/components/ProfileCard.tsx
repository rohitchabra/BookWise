"use client";

import { logout } from "@/lib/actions/auth";
import { getInitials } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import Image from "next/image";
import { Session } from "next-auth";

const ProfileCard = ({
  session,
  universityId,
  universityCard,
}: {
  session: Session;
  universityId?: number | null;
  universityCard?: string | null;
}) => {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-dark-300 p-8">
      <div className="absolute left-1/2 top-0 h-20 w-16 -translate-x-1/2 rounded-b-full bg-dark-500" />

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <Avatar
          fallback={getInitials(session.user?.name || "U")}
          className="size-20 text-2xl"
        />
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-green/20 px-3 py-1 text-xs text-green">
            <span className="size-2 rounded-full bg-green" />
            {session.user?.status === "APPROVED"
              ? "Verified Student"
              : session.user?.status || "PENDING"}
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {session.user?.name}
          </h2>
          <p className="text-light-100">{session.user?.email}</p>
        </div>

        <div className="mt-4 w-full space-y-4 text-left">
          <div>
            <p className="text-sm text-light-100">University</p>
            <p className="text-lg font-semibold text-white">BookWise University</p>
          </div>
          <div>
            <p className="text-sm text-light-100">Student ID</p>
            <p className="text-lg font-semibold text-white">
              {universityId || "—"}
            </p>
          </div>
        </div>

        {universityCard && (
          <div className="relative mt-4 h-40 w-full overflow-hidden rounded-xl">
            <Image
              src={
                universityCard.startsWith("http")
                  ? universityCard
                  : `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${universityCard}`
              }
              alt="University card"
              fill
              className="object-cover"
            />
          </div>
        )}

        <form action={logout} className="mt-4 w-full">
          <button type="submit" className="form-btn bg-red text-white hover:bg-red-dark">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCard;
