"use server";

import { cookies } from "next/headers";
import { toast } from "react-toastify";
import { ReturnRequest, ReturnReasonSummary, ReturnStatus } from "@/types/returns";

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_API}/api/returns`;

const authHeaders = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };
};

export const createReturnRequest = async (payload: Partial<ReturnRequest>) => {
  const headers = await authHeaders();
  if (!headers.Authorization) return { unauthorized: true };
  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (err: any) {
    toast.error(err?.message || "Failed to submit return request");
  }
};

export const fetchMyReturns = async () => {
  const headers = await authHeaders();
  if (!headers.Authorization) return { unauthorized: true };
  try {
    const res = await fetch(`${baseUrl}/me`, { headers, cache: "no-store" });
    return res.json();
  } catch (err: any) {
    toast.error(err?.message || "Failed to load return requests");
  }
};

export const fetchAdminReturns = async () => {
  const headers = await authHeaders();
  if (!headers.Authorization) return { unauthorized: true };
  try {
    const res = await fetch(baseUrl, { headers, cache: "no-store" });
    return res.json();
  } catch (err: any) {
    toast.error(err?.message || "Failed to load returns");
  }
};

export const updateReturnStatus = async (
  id: string,
  status: ReturnStatus,
  resolutionNote?: string
) => {
  const headers = await authHeaders();
  if (!headers.Authorization) return { unauthorized: true };
  try {
    const res = await fetch(`${baseUrl}/${id}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status, resolutionNote }),
    });
    return res.json();
  } catch (err: any) {
    toast.error(err?.message || "Failed to update request");
  }
};

export const fetchReasonAnalytics = async (): Promise<{ success?: boolean; data?: ReturnReasonSummary[] }> => {
  const headers = await authHeaders();
  if (!headers.Authorization) return { unauthorized: true };
  try {
    const res = await fetch(`${baseUrl}/analytics`, { headers, cache: "no-store" });
    return res.json();
  } catch (err: any) {
    toast.error(err?.message || "Failed to load analytics");
    return {};
  }
};
