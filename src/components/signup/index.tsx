"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import authPanel from "@/public/images/auth-right-panel.png";
import { useState } from "react";
import Input from "../common/input";
import { SignupProps } from "./types";
import Link from "next/link";
import Button from "../common/button/Button";
import { useRouter } from "next/navigation";
import { useSignup } from "@/src/hooks/useQueries";

const signupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter and one number"
    ),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignUp = ({}: SignupProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const signupMutation = useSignup({
    onSuccess: (res: any) => {
      console.log("Signup success:", res);
      router.push("/dashboard");
    },
    onError: (err: any) => {
      setError(err.message || "Signup failed. Please try again.");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate({
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <section className="flex flex-col lg:flex-row w-full max-h-minus-navbar overflow-hidden relative">
      {/* Left side - Form */}
      <section className="w-full lg:w-1/2 flex flex-col items-center justify-center z-10">
        <div className="w-full max-w-lg mt-14">
          <h1 className="text-2xl lg:text-3xl font-medium text-center mb-4 text-gray-900">
            Create Your Account
          </h1>

          <>
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-10 mt-10"
            >
              <Input
                label="FIRST NAME"
                placeholder="WRITE YOUR FIRST NAME"
                variant="primary"
                inputSize="md"
                rounded
                {...register("first_name")}
                error={formState.errors.first_name?.message}
                bg="bg-white"
              />
              <Input
                label="LAST NAME"
                placeholder="WRITE YOUR LAST NAME"
                variant="primary"
                inputSize="md"
                rounded
                {...register("last_name")}
                error={formState.errors.last_name?.message}
                bg="bg-white"
              />
              <Input
                label="EMAIL"
                placeholder="ENTER YOUR EMAIL"
                variant="primary"
                inputSize="md"
                rounded
                {...register("email")}
                error={formState.errors.email?.message}
                bg="bg-white"
              />
              <Input
                label="PASSWORD"
                placeholder="ENTER YOUR PASSWORD"
                variant="primary"
                inputSize="md"
                type="password"
                rounded
                {...register("password")}
                error={formState.errors.password?.message}
                bg="bg-white"
              />

              <Button
                type="submit"
                variant="primary"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Signing up..." : "Continue"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              ALREADY HAVE AN ACCOUNT?{" "}
              <Link href="/login" className="text-primary font-medium ">
                LOGIN
              </Link>
            </div>
          </>
        </div>
      </section>

      {/* Right side - Image */}
      <section className="w-full lg:w-1/2 h-screen hidden lg:block relative">
        <Image
          src={authPanel}
          alt="Auth Panel"
          fill
          priority
          className="absolute object-cover inset-0 w-full h-full"
        />
      </section>
    </section>
  );
};

export default SignUp;
