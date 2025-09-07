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
    <section className="min-h-screen flex items-center justify-center px-6 bg-pink-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-pink-200 p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-pink-600 text-center mb-6">
          Sign in to your account
        </h1>

        {/* Test Credentials */}
        <div className="flex gap-3 justify-center mb-6">
          <button
            onClick={handleTestCredential}
            className="px-4 py-2 bg-pink-100 text-pink-700 font-medium rounded-lg hover:bg-pink-200 transition"
          >
            Customer Login
          </button>
          <button
            onClick={handleTestCredential2}
            className="px-4 py-2 bg-pink-100 text-pink-700 font-medium rounded-lg hover:bg-pink-200 transition"
          >
            Admin Login
          </button>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Email
              </label>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="name@domain.com"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:border-pink-400 focus:ring-pink-300"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
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
                        className="w-full border border-gray-300 p-3 rounded-lg focus:border-pink-400 focus:ring-pink-300"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg py-3 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Logging in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            {/* Register link */}
            <p className="text-sm text-gray-600 text-center">
              Don’t have an account yet?{" "}
              <Link
                href="/register"
                className="text-pink-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default Login;
