"use server";

import { cookies } from "next/headers";

export const getUserProfile = async () => {
    const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
      console.error("No token found");
      return null;
  }

  try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/user/profile`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
      });

      if (!res.ok) {
          throw new Error("Failed to fetch user profile");
      }

      return res.json();
  } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
  }
};


export const updateUserInfo = async ( payload: { name: string; phone: string }) => {
    const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
      console.error("No token found");
      return null;
  }

  try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/user/change-user-info`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload), 
      });

      if (!res.ok) {
          throw new Error("Failed to update user info");
      }

      return res.json();
  } catch (err) {
      console.error("Error updating user info:", err);
      return null;
  }
};
