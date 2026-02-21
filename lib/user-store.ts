import bcrypt from "bcryptjs";
import { supabaseAdmin } from "./supabase/server";

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

function fromRow(row: {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}): StoredUser {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
  };
}

export async function readUsers(): Promise<StoredUser[]> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, email, password_hash, created_at");
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function findUserByEmail(
  email: string
): Promise<StoredUser | undefined> {
  const norm = email.trim().toLowerCase();
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, email, password_hash, created_at")
    .ilike("email", norm)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : undefined;
}

export async function createUser(
  email: string,
  password: string
): Promise<StoredUser> {
  const norm = email.trim().toLowerCase();
  if (!norm || !password) throw new Error("邮箱和密码不能为空");

  const existing = await findUserByEmail(norm);
  if (existing) throw new Error("该邮箱已注册");

  const passwordHash = await bcrypt.hash(password, 10);
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      id,
      email: norm,
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
    })
    .select("id, email, password_hash, created_at")
    .single();

  if (error) throw error;
  return fromRow(data);
}
