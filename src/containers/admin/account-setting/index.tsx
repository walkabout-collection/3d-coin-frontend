"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "@/src/components/common/input";
import Button from "@/src/components/common/button/Button";
import {
  useGetUserProfile,
  useUpdateCurrentUserPassword,
  useUpdateCurrentUserProfile,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const formSchema = z
  .object({
    firstName: z
      .string()
      .optional()
      .refine((val) => val === undefined || val === "" || val.length >= 1, {
        message: "First name is required",
      }),
    lastName: z
      .string()
      .optional()
      .refine((val) => val === undefined || val === "" || val.length >= 1, {
        message: "Last name is required",
      }),
    email: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val === "") return true;
          return z.string().email().safeParse(val).success;
        },
        {
          message: "Invalid email address",
        }
      ),
    contactNumber: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val === "") return true;
          return val.length >= 10 && val.length <= 15;
        },
        {
          message: "Contact number must be between 10 and 15 digits",
        }
      ),
    oldPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      const { oldPassword = "", newPassword = "", confirmPassword = "" } = data;
      const changing = oldPassword !== "" || newPassword !== "" || confirmPassword !== "";

      if (!changing) return true;

      const validLength = oldPassword.length >= 6 && newPassword.length >= 6;
      const matches = newPassword === confirmPassword;

      return validLength && matches;
    },
    {
      message:
        "To change password, all fields must be filled, at least 6 characters, and new passwords must match.",
      path: ["confirmPassword"],
    }
  );

type FormData = z.infer<typeof formSchema>;

const AdminAccountSetting: React.FC = () => {
  const {
    data: profile,
    isLoading,
    error,
  } = useGetUserProfile();

  const {
  mutate: updateUserProfile,
  isPending: isProfileUpdating,
} = useUpdateCurrentUserProfile({
  onSuccess(data: unknown) {  
  if (data && typeof data === "object" && "data" in data) {
    const res = data as {  message: string, data: FormData & { id: string }  };
    toast.success(res.message);

    reset({
      firstName: res.data.firstName || "",
      lastName: res.data.lastName || "",
      email: res.data.email || "",
      contactNumber: res.data.contactNumber || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } else {
    toast.success("Profile updated");
  }
},

  onError(error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    toast.error(err.response?.data?.message || "Failed to update profile");
  },
});


  const {
    mutate: changePassword,
    isPending: isChangePasswordPending,
  } = useUpdateCurrentUserPassword({
    onSuccess(data: unknown) {
  if (data && typeof data === "object" && "data" in data) {
    const res = data as { data: { message: string } };
    toast.success(res.data.message);
  } else {
    toast.success("Password updated");
  }
},

    onError(error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to change password");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        contactNumber: profile.contactNumber || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      // Update password if applicable
      if (data.oldPassword && data.newPassword) {
        await new Promise<void>((resolve, reject) =>
          changePassword(
            {
              oldPassword: data.oldPassword || "",
              newPassword: data.newPassword || "",
            },
            {
              onSuccess: () => resolve(),
              onError: (err) => reject(err),
            }
          )
        );
      }

      // Update profile info
      await new Promise<void>((resolve, reject) =>
        updateUserProfile(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            contactNumber: data.contactNumber,
          },
          {
            onSuccess: () => resolve(),
            onError: (err) => reject(err),
          }
        )
      );

      reset();
    } catch (error) {
      console.error(
        "Failed to update: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error loading profile</div>;
  }

  return (
    <div className="max-w-2xl min-h-screen mb-20">
      <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
      <p className="text-gray-600 font-semibold mb-6">
        USER ID: {profile?.id || "N/A"}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="First Name"
            inputSize="md"
            {...register("firstName")}
            error={errors.firstName?.message}
            className="border-none py-4 px-6 rounded-xl"
            bg="bg-gray-100"
            labelClassName="text-md !font-semibold text-gray-900"
          />
          <Input
            label="Last Name"
            placeholder="Last Name"
            inputSize="md"
            {...register("lastName")}
            error={errors.lastName?.message}
            className="border-none py-4 px-6 rounded-xl"
            bg="bg-gray-100"
            labelClassName="text-md !font-semibold text-gray-900"
          />
        </div>
        <Input
          label="Email"
          placeholder="Email"
          type="email"
          inputSize="md"
          {...register("email")}
          error={errors.email?.message}
          className="border-none py-4 px-6 rounded-xl"
          bg="bg-gray-100"
          labelClassName="text-md !font-semibold text-gray-900"
        />
        <Input
          label="Contact Number"
          placeholder="Contact Number"
          type="tel"
          inputSize="md"
          {...register("contactNumber")}
          error={errors.contactNumber?.message}
          className="border-none py-4 px-6 rounded-xl"
          bg="bg-gray-100"
          labelClassName="text-md !font-semibold text-gray-900"
        />
        <Input
          label="OLD PASSWORD"
          placeholder="************"
          type="password"
          inputSize="md"
          {...register("oldPassword")}
          error={errors.oldPassword?.message}
          className="border-none py-4 px-6 rounded-xl"
          bg="bg-gray-100"
          labelClassName="text-md !font-semibold text-gray-900"
        />
        <Input
          label="NEW PASSWORD"
          placeholder="************"
          type="password"
          inputSize="md"
          {...register("newPassword")}
          error={errors.newPassword?.message}
          className="border-none py-4 px-6 rounded-xl"
          bg="bg-gray-100"
          labelClassName="text-md !font-semibold text-gray-900"
        />
        <Input
          label="CONFIRM PASSWORD"
          placeholder="************"
          type="password"
          inputSize="md"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          className="border-none py-4 px-6 rounded-xl"
          bg="bg-gray-100"
          labelClassName="text-md !font-semibold text-gray-900"
        />

        <Button
          type="submit"
          variant="primary"
          disabled={isChangePasswordPending || isProfileUpdating}
          className="max-w-[100px] rounded-full py-3 font-semibold mt-6 mb-20"
        >
          {isChangePasswordPending || isProfileUpdating ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
};

export default AdminAccountSetting;
