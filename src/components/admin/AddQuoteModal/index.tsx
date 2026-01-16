"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "../../common/input";
import Button from "../../common/button/Button";
import ImageUpload from "../../common/imageUpload";
import { X } from "lucide-react";
import { useCreateDesign } from "@/src/hooks/useQueries";
import { uploadBase64ToS3 } from "@/src/services/apiServices";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

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
  image: z.instanceof(File, { message: "Image is required" }),
});

type FormData = z.infer<typeof formSchema>;

interface AddQuoteModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddQuoteModal: React.FC<AddQuoteModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      description: "",
    },
  });

  const { mutate: createDesign } = useCreateDesign({
    onSuccess: () => {
      toast.success("Quote created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminQuotes"] });
      reset();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create quote";
      toast.error(errorMessage);
      setIsSubmitting(false);
    },
  });

  // Convert File to base64
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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Upload image to S3 if provided
      let imageKey: string | undefined;
      if (data.image) {
        try {
          const base64Image = await fileToBase64(data.image);
          const fileName = `quote-image-${Date.now()}.${data.image.name.split(".").pop() || "png"}`;
          imageKey = await uploadBase64ToS3(base64Image, fileName);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to upload image";
          toast.error(`Image upload failed: ${errorMessage}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Create design/quote
      const designData = {
        name: `${data.firstName} ${data.lastName} - Quote`,
        email: data.email,
        status: "SUBMITTED" as const,
        method: "MANUAL" as const,
        designerInstructions: data.description,
        frontImage: imageKey,
        frontDescription: data.description,
        // Store contact number in feedback field if needed
        feedback: data.contactNumber
          ? `Contact: ${data.contactNumber}`
          : undefined,
      };

      createDesign(designData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create quote";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setValue("image", file, { shouldValidate: true });
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] relative overflow-y-auto transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Add New Quote</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 md:p-8">
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
                labelClassName="text-md font-semibold text-gray-900"
              />
              <Input
                label="Last Name"
                placeholder="Last Name"
                inputSize="md"
                {...register("lastName")}
                error={errors.lastName?.message}
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                labelClassName="text-md font-semibold text-gray-900"
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
              labelClassName="text-md font-semibold text-gray-900"
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
              labelClassName="text-md font-semibold text-gray-900"
            />
            <Input
              label="Describe your coin in detail"
              placeholder="Describe your coin in detail..."
              inputSize="lg"
              textarea={true}
              rows={4}
              {...register("description")}
              error={errors.description?.message}
              className="border-none py-4 px-6 rounded-xl"
              bg="bg-gray-100"
              labelClassName="text-md font-semibold text-gray-900"
            />
            <div className="flex justify-center my-2 items-center">
              <div className="border-t border-gray-400 w-full"></div>
              <div className="px-4 text-sm text-center font-medium text-gray-700 bg-white">
                AND/OR
              </div>
              <div className="border-t border-gray-400 w-full"></div>
            </div>
            <label className="block mb-2 text-md font-semibold text-gray-900 mt-2">
              Add a design preference image
            </label>
            <ImageUpload
              onChange={handleFileChange}
              value={watch("image")}
              error={errors.image?.message}
              id="design-image-upload"
            />
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
              <Button
                type="submit"
                variant="primary"
                className="px-8 py-3 shadow-md hover:shadow-lg transition-shadow"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Add Quote"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuoteModal;
