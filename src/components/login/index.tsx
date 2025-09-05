"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import authPanel from "@/public/images/auth-right-panel.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Input from "../common/input";
import Button from "../common/button/Button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.[A-Z])(?=.\d)/,
      "Password must contain at least one uppercase letter and one number",
    ),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Login Data:", data); 
    router.push("/dashboard"); 
  };

  return (
    <section className="flex flex-col lg:flex-row w-full max-h-minus-navbar overflow-hidden relative">
      {/* Left side - Form */}
      <section className="w-full lg:w-1/2 flex flex-col items-center justify-center z-10">
        <div className="w-full max-w-lg mt-14">
          <h1 className="text-3xl lg:text-3xl font-medium text-center mb-4 text-gray-900">
            Welcome!
          </h1>

          <>
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 mt-10">
              {/* Email */}
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

              {/* Password */}
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

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              
            >
              {isSubmitting ? "Logging In..." : "Continue"}
            </Button>
            </form>

              <div className="text-center mt-4 text-md text-gray-600">
                DON'T HAVE AN ACCOUNT?{" "}
                <Link href="/signup" className="text-primary font-medium ">
                    SIGN UP
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

export default Login;