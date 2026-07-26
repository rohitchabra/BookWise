"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { checkRateLimit } from "@/lib/ratelimit";
import type { AuthCredentials, ActionResult } from "@/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">,
): Promise<ActionResult> {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await checkRateLimit(ip);

  if (!success) {
    return {
      success: false,
      error: "Too many requests. Please try again later.",
    };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Invalid email or password." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Sign in failed. Please try again." };
  }
}

export async function signUp(
  params: AuthCredentials,
): Promise<ActionResult> {
  const { fullName, email, universityId, password, universityCard } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await checkRateLimit(ip);

  if (!success) {
    return {
      success: false,
      error: "Too many requests. Please try again later.",
    };
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists." };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch {
    return { success: false, error: "Sign up failed. Please try again." };
  }
}

export async function logout() {
  const { signOut } = await import("@/auth");
  await signOut({ redirect: false });
  redirect("/sign-in");
}
