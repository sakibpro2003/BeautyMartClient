"use server";

import { cookies } from "next/headers";
import { toast } from "react-toastify";
import { TShadeQuiz } from "@/types/shadeQuiz";

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_API}/api/shade-quiz`;

const authHeaders = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return null;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const submitShadeQuiz = async (payload: Partial<TShadeQuiz>) => {
  const headers = await authHeaders();
  if (!headers) return { unauthorized: true };
  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (err: any) {
    toast.error(err?.message || "Failed to submit quiz");
  }
};

export const fetchMyShadeQuiz = async () => {
  const headers = await authHeaders();
  if (!headers) return { unauthorized: true };
  try {
    const res = await fetch(`${baseUrl}/me`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    return res.json();
  } catch (err: any) {
    toast.error(err?.message || "Failed to load quiz");
  }
};
