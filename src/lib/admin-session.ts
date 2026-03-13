import crypto from "node:crypto";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

const ADMIN_COOKIE = "almamater-admin-session";

function getSessionSecret() {
  return process.env.NEXTAUTH_SECRET || "change-me";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function createSessionValue(adminId: string, email: string) {
  const payload = `${adminId}:${email}`;
  return `${payload}:${sign(payload)}`;
}

function parseSessionValue(value: string) {
  const parts = value.split(":");
  if (parts.length < 3) return null;

  const signature = parts.pop()!;
  const email = parts.pop()!;
  const adminId = parts.join(":");
  const payload = `${adminId}:${email}`;

  if (sign(payload) !== signature) {
    return null;
  }

  return { adminId, email };
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!raw) return null;

  const parsed = parseSessionValue(raw);
  if (!parsed) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { id: parsed.adminId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!admin || admin.email !== parsed.email) {
    return null;
  }

  return admin;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function createAdminSession(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return { ok: false as const, error: "Credenciales invalidas." };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { ok: false as const, error: "Credenciales invalidas." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createSessionValue(admin.id, admin.email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { ok: true as const };
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
