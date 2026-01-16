// 'use client';
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import Input from '@/src/components/common/input';
// import Button from '@/src/components/common/button/Button';

// const formSchema = z.object({
//   firstName: z.string().min(1, 'First name is required'),
//   lastName: z.string().min(1, 'Last name is required'),
//   email: z.string().email('Invalid email address').min(1, 'Email is required'),
//   contactNumber: z.string().min(10, 'Contact number must be at least 10 digits').max(15, 'Contact number too long'),
//   changePassword: z.string().min(6, 'Password must be at least 6 characters'),
// });

// type FormData = z.infer<typeof formSchema>;

// const AccountSetting: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       contactNumber: '',
//       changePassword: '',
//     },
//   });

//   const onSubmit = (data: FormData) => {
//     console.log('Form Data:', data);
//     reset();
//   };

// return (
//    <div className=" max-w-2xl min-h-screen mb-20">
//       <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
//       <p className="text-gray-600 font-semibold mb-6">USER ID: 12345 </p>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
//         <div className="grid grid-cols-2 gap-4">
//           <Input
//             label="First Name"
//             placeholder="First Name"
//             inputSize="md"
//             {...register('firstName')}
//             error={errors.firstName?.message}
//             className="border-none py-4 px-6 rounded-xl"
//             bg="bg-gray-100"
//             labelClassName="text-md !font-semibold text-gray-900"
//           />
//           <Input
//             label="Last Name"
//             placeholder="Last Name"
//             inputSize="md"
//             {...register('lastName')}
//             error={errors.lastName?.message}
//             className="border-none py-4 px-6 rounded-xl"
//             bg="bg-gray-100"
//             labelClassName="text-md !font-semibold text-gray-900"
//           />
//         </div>
//         <Input
//           label="Email"
//           placeholder="Email"
//           type="email"
//           inputSize="md"
//           {...register('email')}
//           error={errors.email?.message}
//           className="border-none py-4 px-6 rounded-xl"
//           bg="bg-gray-100"
//           labelClassName="text-md !font-semibold text-gray-900"
//         />

//        <Input
//             label="CHANGE PASSWORD"
//             placeholder="************"
//             type="password"
//             inputSize="md"
//             {...register('changePassword')}
//             error={errors.changePassword?.message}
//           className="border-none py-4 px-6 rounded-xl"
//           bg="bg-gray-100"
//           labelClassName="text-md !font-semibold text-gray-900"
//         />
//        <Input
//           label="Contact Number"
//           placeholder="Contact Number"
//           type="tel"
//           inputSize="md"
//           {...register('contactNumber')}
//           error={errors.contactNumber?.message}
//           className="border-none py-4 px-6 rounded-xl"
//           bg="bg-gray-100"
//           labelClassName="text-md !font-semibold text-gray-900"
//         />
//         <Button
//           type="submit"
//           variant="primary"
//           className="max-w-[100px]  rounded-full py-3 font-semibold mt-6 mb-20"
//         >
//           Save
//             </Button>
//       </form>
//     </div>
//   );
// };

// export default AccountSetting;

"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import Input from "@/src/components/common/input";
import Button from "@/src/components/common/button/Button";
import Image from "next/image";
import {
  useGetUserProfile,
  useUpdateCurrentUserProfile,
  useUpdateCurrentUserPassword,
} from "@/src/hooks/useQueries";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  X,
  Loader2,
  Settings as SettingsIcon,
} from "lucide-react";

// Helper function to get user initials
// Returns: first letter of first name + first letter of last name (if both exist)
//          OR only first letter of first name (if last name is missing)
const getUserInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.trim().charAt(0).toUpperCase() || "";
  const last = lastName?.trim().charAt(0).toUpperCase() || "";

  // If first name exists, show it (with last initial if available)
  if (first) {
    return first + last;
  }

  // Fallback to last name initial if first name is missing
  if (last) {
    return last;
  }

  // Final fallback
  return "U";
};

// Helper function to get full name
const getUserFullName = (firstName?: string, lastName?: string): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || "User";
};

// Account Settings Schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number too long"),
});

type FormData = z.infer<typeof formSchema>;

// Password Reset Schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const AccountSetting: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading, error } = useGetUserProfile();

  // Update user profile mutation
  const { mutate: updateUserProfile, isPending: isProfileUpdating } =
    useUpdateCurrentUserProfile({
      onSuccess(data: unknown) {
        // Invalidate and refetch user profile to update navbar
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });

        if (data && typeof data === "object" && "data" in data) {
          const res = data as {
            message: string;
            data: FormData & { id: string };
          };
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
  const { mutate: changePassword, isPending: isChangePasswordPending } =
    useUpdateCurrentUserPassword({
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

  // Main Form
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

  // Password Modal Form
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

  const onSubmit = (data: FormData) => {
    // Exclude email from update since it cannot be changed
    const { email, ...updateData } = data;
    updateUserProfile(updateData);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePassword({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1a2a3a]" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Profile
              </h3>
              <p className="text-sm text-gray-600">
                Failed to load your profile. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex items-center gap-6">
            {/* Profile Avatar */}
            <div className="w-20 h-20 rounded-full relative overflow-hidden border-4 border-gray-100 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 flex-shrink-0 shadow-md">
              {profile?.image && profile.image.trim() !== "" ? (
                <Image
                  src={profile.image}
                  alt={getUserFullName(profile.firstName, profile.lastName)}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-3xl">
                  {getUserInitials(profile?.firstName, profile?.lastName)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Account Settings
                </h1>
                <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
                  <SettingsIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-1">
                Welcome,{" "}
                {getUserFullName(profile?.firstName, profile?.lastName)}!
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium">User ID:</span>
                <span className="bg-gray-100 px-2 py-1 rounded-md font-mono">
                  {profile?.id || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Personal Information
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="h-4 w-4 text-gray-400" />
                  First Name
                </label>
                <Input
                  placeholder="Enter your first name"
                  inputSize="md"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                  className="border border-gray-200 py-3 px-4 rounded-lg focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent transition-all"
                  bg="bg-white"
                  labelClassName="hidden"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="h-4 w-4 text-gray-400" />
                  Last Name
                </label>
                <Input
                  placeholder="Enter your last name"
                  inputSize="md"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                  className="border border-gray-200 py-3 px-4 rounded-lg focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent transition-all"
                  bg="bg-white"
                  labelClassName="hidden"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="h-4 w-4 text-gray-400" />
                Email Address
                <span className="text-xs font-normal text-gray-500 ml-2">
                  (Cannot be changed)
                </span>
              </label>
              <Input
                placeholder="Enter your email address"
                type="email"
                inputSize="md"
                {...register("email")}
                error={errors.email?.message}
                disabled={true}
                className="border border-gray-200 py-3 px-4 rounded-lg bg-gray-50 cursor-not-allowed opacity-75"
                bg="bg-gray-50"
                labelClassName="hidden"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone className="h-4 w-4 text-gray-400" />
                Contact Number
              </label>
              <Input
                placeholder="Enter your contact number"
                type="tel"
                inputSize="md"
                {...register("contactNumber")}
                error={errors.contactNumber?.message}
                className="border border-gray-200 py-3 px-4 rounded-lg focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent transition-all"
                bg="bg-white"
                labelClassName="hidden"
              />
            </div>

            {/* Password Section */}
            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Lock className="h-4 w-4 text-gray-400" />
                Password
              </label>
              <Button
                type="button"
                variant="ternary"
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                disabled={isProfileUpdating}
                className="flex items-center gap-2 px-8 py-3 shadow-md hover:shadow-lg transition-shadow"
              >
                {isProfileUpdating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Password Change Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a2a3a] rounded-lg flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Change Password
                  </h3>
                </div>
                <button
                  onClick={() => {
                    resetPasswordForm();
                    setIsModalOpen(false);
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="p-6 space-y-5"
              >
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="h-4 w-4 text-gray-400" />
                    Current Password
                  </label>
                  <Input
                    placeholder="Enter current password"
                    type="password"
                    {...registerPassword("currentPassword")}
                    error={passwordErrors.currentPassword?.message}
                    className="border border-gray-200 py-3 px-4 rounded-lg focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent transition-all"
                    bg="bg-white"
                    labelClassName="hidden"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="h-4 w-4 text-gray-400" />
                    New Password
                  </label>
                  <Input
                    placeholder="Enter new password"
                    type="password"
                    {...registerPassword("newPassword")}
                    error={passwordErrors.newPassword?.message}
                    className="border border-gray-200 py-3 px-4 rounded-lg focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent transition-all"
                    bg="bg-white"
                    labelClassName="hidden"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="h-4 w-4 text-gray-400" />
                    Confirm Password
                  </label>
                  <Input
                    placeholder="Confirm new password"
                    type="password"
                    {...registerPassword("confirmPassword")}
                    error={passwordErrors.confirmPassword?.message}
                    className="border border-gray-200 py-3 px-4 rounded-lg focus:ring-2 focus:ring-[#1a2a3a] focus:border-transparent transition-all"
                    bg="bg-white"
                    labelClassName="hidden"
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="ternary"
                    className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors"
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
                    className="flex items-center gap-2 px-6 py-2.5 shadow-md hover:shadow-lg transition-shadow"
                  >
                    {isChangePasswordPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSetting;
