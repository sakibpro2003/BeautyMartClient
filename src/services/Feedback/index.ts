"use server";

import { cookies } from "next/headers";
import { toast } from "react-toastify";
import { FeedbackStatus, FeedbackType } from "@/types/feedback";

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_API}/api/feedback`;

const authHeaders = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return null;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const submitFeedback = async (payload: { subject: string; message: string; type: FeedbackType }) => {
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
    toast.error(err?.message || "Failed to send feedback");
  }
};

export const fetchMyFeedback = async () => {
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
    toast.error(err?.message || "Failed to load feedback");
  }
};

export const fetchAdminFeedback = async () => {
  const headers = await authHeaders();
  if (!headers) return { unauthorized: true };
  try {
    const res = await fetch(baseUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    return res.json();
  } catch (err: any) {
    toast.error(err?.message || "Failed to load feedback");
  }
};

export const replyToFeedback = async (
  id: string,
  payload: { adminReply?: string; status?: FeedbackStatus }
) => {
  const headers = await authHeaders();
  if (!headers) return { unauthorized: true };
  try {
    const res = await fetch(`${baseUrl}/${id}/reply`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (err: any) {
    toast.error(err?.message || "Failed to reply");
  }
};
