"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateUserRole, deleteUser } from "@/lib/actions/admin";

interface UserRowActionsProps {
  userId: string;
  role: string;
}

const UserRowActions = ({ userId, role }: UserRowActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const toggleRole = () => {
    startTransition(async () => {
      const nextRole = role === "ADMIN" ? "USER" : "ADMIN";
      const result = await updateUserRole(userId, nextRole);
      if (result.success) toast.success(`Role updated to ${nextRole}`);
      else toast.error(result.error);
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this user?")) return;
    startTransition(async () => {
      const result = await deleteUser(userId);
      if (result.success) toast.success("User deleted");
      else toast.error(result.error);
    });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleRole}
        disabled={isPending}
        className="rounded-md bg-blue-light px-3 py-1 text-xs font-medium text-blue"
      >
        {role === "ADMIN" ? "Demote" : "Promote"}
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-md bg-red-light px-3 py-1 text-xs font-medium text-red"
      >
        Delete
      </button>
    </div>
  );
};

export default UserRowActions;
