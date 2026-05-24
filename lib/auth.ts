import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { canAccess, type AppSection, type Role } from "@/lib/permissions";

export const AUTH_COOKIE = "civitrack_session";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  position: string;
};

export function createSessionToken(user: CurrentUser) {
  return Buffer.from(JSON.stringify(user)).toString("base64url");
}

export function parseSessionToken(token?: string): CurrentUser | null {
  if (!token) return null;

  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    if (!payload?.id || !payload?.email || !payload?.role) return null;
    return payload as CurrentUser;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.email }
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    position: user.position
  } satisfies CurrentUser;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requirePageAccess(section: AppSection) {
  const user = await requireUser();

  if (!canAccess(user.role, section)) {
    redirect("/dashboard?denied=1");
  }

  return user;
}

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  });

  if (!user || user.password !== password) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    position: user.position
  } satisfies CurrentUser;
}
