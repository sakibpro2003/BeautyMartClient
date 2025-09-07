/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Loader from "@/components/Loader";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAdminAuth = (WrappedComponent: React.FC) => {
  return function ProtectedRoute(props: any) {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !(user?.role === "admin")) {
        router.push("/login");
      }
    }, [user, isLoading, router]);

    if (isLoading) return <Loader></Loader>;

    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAdminAuth;
