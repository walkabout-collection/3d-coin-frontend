"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Input from "../common/input";
import Button from "../common/button/Button";
import ImageUpload from "../common/imageUpload";
import { useCreateContact } from "@/src/hooks/useQueries";
import { uploadBase64ToS3 } from "@/src/services/apiServices";
import LoadingSpinner from "../common/LoadingSpinner";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  image: z.instanceof(File).nullable(),
});

type FormData = z.infer<typeof formSchema>;

const DesignTeamForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: createContactMutation } = useCreateContact();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (file: File | null) => {
    setValue("image", file, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined;

      // Step 1: Upload image to S3 if provided
      if (data.image) {
        const base64Image = await fileToBase64(data.image);
        const extension = data.image.name.split(".").pop() || "png";
        const fileName = `design-team-${Date.now()}.${extension}`;
        imageUrl = await uploadBase64ToS3(base64Image, fileName);
      }

      // Step 2: Submit contact form with uploaded image URL
      await createContactMutation({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        contactNumber: data.contactNumber,
        description: data.description,
        image: imageUrl,
      });

      reset();
      router.push("/");
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16">
      <h2 className="text-3xl max-w-xl mx-auto font-bold text-gray-900 mb-6 text-center">
        Work with our expert team to create your custom design.
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="First Name"
            inputSize="md"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            placeholder="Last Name"
            inputSize="md"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>
        <Input
          label="Email"
          placeholder="Email"
          type="email"
          inputSize="md"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Contact Number"
          placeholder="Contact Number"
          type="tel"
          inputSize="md"
          {...register("contactNumber")}
          error={errors.contactNumber?.message}
        />
        <Input
          label="Describe your coin in detail"
          placeholder="Describe your coin in detail..."
          inputSize="lg"
          textarea
          rows={4}
          {...register("description")}
          error={errors.description?.message}
        />

        <div className="flex justify-center my-2 items-center">
          <div className="border-t border-gray-400 w-full"></div>
          <div className="px-4 text-sm text-center font-medium text-gray-700 bg-white">
            AND/OR
          </div>
          <div className="border-t border-gray-400 w-full"></div>
        </div>

        <label className="block mb-2 text-[15px] font-semibold text-gray-900 mt-2">
          Add a design preference image
        </label>
        <ImageUpload
          onChange={handleFileChange}
          value={watch("image")}
          error={errors.image?.message}
          id="design-image-upload"
        />

        <Button
          type="submit"
          variant="primary"
          className="max-w-xs mx-auto rounded-full py-3 font-semibold mt-10 flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="text-white" />
              <span>Sending...</span>
            </>
          ) : (
            "Send to Design Team"
          )}
        </Button>
      </form>
    </div>
  );
};

export default DesignTeamForm;
