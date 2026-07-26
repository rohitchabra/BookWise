"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateUserStatus } from "@/lib/actions/admin";

const AccountRequestActions = ({ userId }: { userId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handle = (status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      const result = await updateUserStatus(userId, status);
      if (result.success) {
        toast.success(
          status === "APPROVED" ? "Request Approved" : "Request Denied",
        );
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle("APPROVED")}
        disabled={isPending}
        className="rounded-md bg-green-light px-3 py-1.5 text-xs font-semibold text-green"
      >
        Approve
      </button>
      <button
        onClick={() => handle("REJECTED")}
        disabled={isPending}
        className="rounded-md bg-red-light px-3 py-1.5 text-xs font-semibold text-red"
      >
        Deny
      </button>
    </div>
  );
};

export default AccountRequestActions;
