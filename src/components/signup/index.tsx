"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import authPanel from "@/public/images/auth-right-panel.png";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "../common/input";
import { SignupProps } from "./types";
import Link from "next/link";
import Button from "../common/button/Button";

const signupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.[A-Z])(?=.\d)/,
      "Password must contain at least one uppercase letter and one number"
    ),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignUp = ({}: SignupProps) => {
  //   const router = useRouter();

  const [error] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    console.log("Signup Data:", data);
    // onSignupSuccess?.();
    // router.push("/verify-otp");
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
              <div className="relative">
                <Input
                  label="FIRST NAME"
                  placeholder="WRITE YOUR FIRST NAME"
                  variant="primary"
                  inputSize="md"
                  {...register("first_name")}
                  error={errors.first_name?.message}
                />
              </div>
              <div className="relative">
                <Input
                  label="LAST NAME"
                  placeholder="WRITE YOUR LAST NAME"
                  variant="primary"
                  inputSize="md"
                  {...register("last_name")}
                  error={errors.last_name?.message}
                />
              </div>
              <div className="relative">
                <Input
                  label="EMAIL"
                  placeholder="ENTER YOUR EMAIL"
                  variant="primary"
                  inputSize="md"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
              <div className="relative">
                <Input
                  label="PASSWORD"
                  placeholder="ENTER YOUR PASSWORD"
                  variant="primary"
                  inputSize="md"
                  type="password"
                  {...register("password")}
                  error={errors.password?.message}
                />
              </div>

              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Logging In..." : "Continue"}
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
