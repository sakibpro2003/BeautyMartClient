/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { loginUser } from "@/services/AuthService";
import { loginSchema } from "./loginValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

const Login = () => {
  const router = useRouter();
  const { setIsLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleTestCredential = () => {
    form.setValue("password", "1111");
    form.setValue("email", "user1@gmail.com");
  };
  const handleTestCredential2 = () => {
    form.setValue("password", "1111");
    form.setValue("email", "admin@gmail.com");
  };

  const onSubmit: SubmitHandler<FieldValues> = async (loginData) => {
    setLoading(true);
    try {
      const res = await loginUser(loginData);
      if (res?.success === true) {
        toast.success("Login successful!");
        setIsLoading(true);
        router.push("/");
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      console.log(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 px-4 py-10 relative overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl bg-white/80 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.06)] ring-1 ring-pink-100/70 backdrop-blur lg:flex-row lg:p-10">
        <div className="flex flex-1 flex-col justify-between gap-6 rounded-2xl bg-gradient-to-br from-pink-600 via-pink-500 to-orange-400 p-6 text-white shadow-lg">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">Welcome back</p>
            <h1 className="text-3xl font-bold leading-tight">Sign in to BeautyMart</h1>
            <p className="text-sm text-white/80">
              Access personalized recommendations, manage your orders, and keep your favorites in
              sync across devices.
            </p>
          </div>
          <div className="grid gap-3 rounded-2xl bg-white/15 p-4 ring-1 ring-white/30">
            <p className="text-sm font-semibold text-white">Quick login</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleTestCredential}
                className="rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
              >
                Customer test
              </button>
              <button
                onClick={handleTestCredential2}
                className="rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
              >
                Admin test
              </button>
            </div>
            <ul className="grid gap-2 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                One-tap autofill for demo accounts
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Secure checkout and order tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Beauty picks curated just for you
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1 rounded-2xl bg-white p-6 shadow-inner ring-1 ring-gray-100">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-pink-500">Login</p>
            <h2 className="text-2xl font-bold text-gray-900">Sign in to continue</h2>
            <p className="text-sm text-gray-600">Use your email and password to access your account.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Email</label>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="name@domain.com"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Password</label>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm shadow-sm focus:border-pink-400 focus:ring-pink-300"
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Don’t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-pink-600 hover:text-pink-700"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Login;
