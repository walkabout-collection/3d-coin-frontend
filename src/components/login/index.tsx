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
import { useLogin } from "@/src/hooks/useQueries";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Please enter your password"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useLogin({
    // onSuccess: (response) => {
    //   console.log("Full response:", response);

    //   const { user, accessToken, refreshToken } = response;

    //   console.log("Logged in user:", user);
    //   console.log("Access Token:", accessToken);
    //   console.log("Refresh Token:", refreshToken);

    //   // store token for future requests
    //   localStorage.setItem("accessToken", accessToken as string);
    //   localStorage.setItem("refreshToken", refreshToken as string);

    //   // redirect
    //   router.push("/dashboard");
    // },
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response;

      document.cookie = `token=${accessToken}; path=/; max-age=86400`; // 1 day
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800`; // 7 days
      window.dispatchEvent(new Event("authChanged"));

      router.push("/dashboard");
    },

    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
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

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-10 mt-10"
            >
              {/* Email */}
              <div className="relative">
                <Input
                  label="EMAIL"
                  placeholder="ENTER YOUR EMAIL"
                  variant="primary"
                  inputSize="md"
                  rounded={true}
                  {...register("email")}
                  error={errors.email?.message}
                  bg="bg-white"
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
                  rounded={true}
                  {...register("password")}
                  error={errors.password?.message}
                  bg="bg-white"
                />
              </div>

              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Logging In..." : "Continue"}
              </Button>
            </form>

            <div className="text-center mt-4 text-md text-gray-600">
              DON&apos;T HAVE AN ACCOUNT?{" "}
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
