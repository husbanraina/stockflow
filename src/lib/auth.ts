import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: string;
  organizationId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function getUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as AuthUser;
    return decoded;
  } catch (error) {
    // Return null if token is invalid or expired
    return null;
  }
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Core tenant enforcement method.
 * All data access MUST be scoped through the organizationId returned here.
 */
export async function requireOrganization(): Promise<string> {
  const user = await requireUser();
  if (!user.organizationId) {
    throw new Error("User does not belong to an organization. Tenant missing.");
  }
  return user.organizationId;
}
