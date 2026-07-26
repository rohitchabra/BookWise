"use server";

import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import type { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateUserStatus(
  userId: string,
  status: "APPROVED" | "REJECTED" | "PENDING",
): Promise<ActionResult> {
  try {
    await db.update(users).set({ status }).where(eq(users.id, userId));
    revalidatePath("/admin/account-requests");
    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update user status." };
  }
}

export async function updateUserRole(
  userId: string,
  role: "USER" | "ADMIN",
): Promise<ActionResult> {
  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update user role." };
  }
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete user." };
  }
}
