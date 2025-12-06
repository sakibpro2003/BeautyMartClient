"use server";

import { cookies } from "next/headers";
import { toast } from "react-toastify";
import { SiteContent } from "@/types/content";

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_API}/api/content`;

export const fetchSiteContent = async (): Promise<{ success?: boolean; data?: SiteContent }> => {
  try {
    const res = await fetch(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    return res.json();
  } catch (error: any) {
    toast.error(error?.message || "Failed to load site content");
    return {};
  }
};

export const saveSiteContent = async (payload: Partial<SiteContent>) => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return { unauthorized: true };
  }

  try {
    const res = await fetch(baseUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (error: any) {
    toast.error(error?.message || "Failed to save content");
  }
};
