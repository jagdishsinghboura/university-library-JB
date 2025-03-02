"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");
  console.log("Attempting to sign in with credentials:", params);

  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    console.log("Sign in result:", result);

    if (result?.error) {
      console.error("Sign in error:", result.error);
      return { success: false, error: result.error };
    }

    console.log("Sign in successful");
    return { success: true };
  } catch (error) {
    console.error("SignIn error:", error);
    return { success: false, error: "An error occurred during sign-in" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, password, universityCard } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.trim()))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "Email already exists" };
    }

    const hashedPassword = await hash(password.trim(), 10);

    await db.insert(users).values({
      fullName,
      email,
      universityId,
      universityCard,
      password: hashedPassword,
    });

    const signInResponse = await signInWithCredentials({ email, password });

    if (!signInResponse.success) {
      return { success: false, error: "User registered, but sign-in failed" };
    }

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "An error occurred during sign-up" };
  }
};
