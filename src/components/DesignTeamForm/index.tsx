"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "../common/input";
import Button from "../common/button/Button";
import ImageUpload from "../common/imageUpload";
import { useCreateContact, useUploadImage } from "@/src/hooks/useQueries";

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

  const { mutateAsync: uploadImageMutation } = useUploadImage();
  const { mutateAsync: createContactMutation } = useCreateContact();

  const handleFileChange = (file: File | null) => {
    if (file) setValue("image", file, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    try {
      let imageUrl: string | undefined;

      // Step 1: Upload image if exists
      if (data.image) {
        const uploadRes = await uploadImageMutation({ image: data.image });
        imageUrl = uploadRes.url;
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
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit form. Please try again.");
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
          className="max-w-xs mx-auto rounded-full py-3 font-semibold mt-10"
        >
          Send to Design Team
        </Button>
      </form>
    </div>
  );
};

export default DesignTeamForm;
