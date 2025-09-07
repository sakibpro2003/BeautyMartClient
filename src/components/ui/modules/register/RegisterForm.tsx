"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "./registerValidation";
import { registerUser } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      profileImage: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (userData) => {
    console.log("clicking");
    setLoading(true);
    try {
      const res = await registerUser(userData);
      console.log(userData, "user data reg");
      if (res?.success === true) {
        // console.log(res,'res form')
        toast.success("Registration successful!");
        router.push("/login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const password = form.watch("password");
  const confirm_password = form.watch("confirm_password");

  if (!isClient) return null;

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center px-6">
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300">
        {/* Left: Image */}
        <div className="w-1/2 relative hidden md:block">
          <Image
            src="https://hp-media-prod-bucket.s3.ap-south-1.amazonaws.com/media/None/app-banner-25-new1.jpg"
            alt="register-banner"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <h3 className="text-3xl font-semibold text-center text-gray-900 mb-6">
            Sign Up
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    {password &&
                    confirm_password &&
                    password !== confirm_password ? (
                      <FormMessage>Passwords do not match!</FormMessage>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full btn-custom text-white flex justify-center items-center"
                disabled={
                  loading ||
                  !password ||
                  !confirm_password ||
                  password !== confirm_password
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>

              {/* Link to Login */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
