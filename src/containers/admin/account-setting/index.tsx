"use client";
import React, { useEffect, useState } from "react";
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

// Main form schema without password fields
const formSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required"),
  lastName: z
    .string()
    .min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number too long"),
});

// Password form schema for modal
const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const AdminAccountSetting: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user profile
  const { data: profile, isLoading, error } = useGetUserProfile();

  // Update user profile mutation
  const {
    mutate: updateUserProfile,
    isPending: isProfileUpdating,
  } = useUpdateCurrentUserProfile({
    onSuccess(data: unknown) {
      if (data && typeof data === "object" && "data" in data) {
        const res = data as { message: string; data: FormData & { id: string } };
        toast.success(res.message);
        reset(res.data);
      } else {
        toast.success("Profile updated");
      }
    },
    onError(error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to update profile");
    },
  });

  // Change password mutation
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
      setIsModalOpen(false);
      resetPasswordForm();
    },
    onError(error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to change password");
    },
  });

  // Main form (profile info)
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
    },
  });

  // Password form (modal)
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Prefill profile data
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        contactNumber: profile.contactNumber || "",
      });
    }
  }, [profile, reset]);

  // Submit profile update
  const onSubmit = (data: FormData) => {
    updateUserProfile(data);
  };

  // Submit password update from modal
  const onPasswordSubmit = (data: PasswordFormData) => {
    changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
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
      <p className="text-gray-600 font-semibold mb-6">USER ID: {profile?.id || "N/A"}</p>

      {/* Profile form */}
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

        {/* Change Password Button */}
        <div>
          <label className="text-md font-semibold text-gray-900 mb-1 block">Password</label>
          <Button
            type="button"
            variant="secondary"
            className="mt-1 py-2 px-6 rounded-full max-w-[280px]"
            onClick={() => setIsModalOpen(true)}
          >
            Change Password
          </Button>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isProfileUpdating}
          className="max-w-[100px] rounded-full py-3 font-semibold mt-6 mb-20"
        >
          {isProfileUpdating ? "Saving..." : "Save"}
        </Button>
      </form>

      {/* Password Change Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-6">Change Password</h3>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <Input
                label="Current Password"
                placeholder="********"
                type="password"
                {...registerPassword("oldPassword")}
                error={passwordErrors.oldPassword?.message}
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                labelClassName="text-md !font-semibold text-gray-900"
              />
              <Input
                label="New Password"
                placeholder="********"
                type="password"
                {...registerPassword("newPassword")}
                error={passwordErrors.newPassword?.message}
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                labelClassName="text-md !font-semibold text-gray-900"
              />
              <Input
                label="Confirm Password"
                placeholder="********"
                type="password"
                {...registerPassword("confirmPassword")}
                error={passwordErrors.confirmPassword?.message}
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                labelClassName="text-md !font-semibold text-gray-900"
              />

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-full px-5 py-2"
                  onClick={() => {
                    resetPasswordForm();
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isChangePasswordPending}
                  className="rounded-full px-5 py-2"
                >
                  {isChangePasswordPending ? "Saving..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccountSetting;
