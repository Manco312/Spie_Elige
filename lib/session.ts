import { cookies } from "next/headers";

const VOTER_COOKIE = "voter_id";
const ADMIN_COOKIE = "is_spie_admin";

export async function setVoterSession(voterId: number) {
  const cookieStore = await cookies();
  cookieStore.set(VOTER_COOKIE, String(voterId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 hours
  });
}

export async function getVoterSession(): Promise<number | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(VOTER_COOKIE)?.value;
  return value ? parseInt(value, 10) : null;
}

export async function clearVoterSession() {
  const cookieStore = await cookies();
  cookieStore.delete(VOTER_COOKIE);
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "true";
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
