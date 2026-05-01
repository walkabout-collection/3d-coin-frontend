"use client";
import React, { useRef, useState } from "react";
import { X, ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/src/components/common/button/Button";

interface DesignerHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Optional override for the actual submission. If not provided, the modal
  // closes and shows a generic "we'll be in touch" toast — backend wiring is
  // expected to be added by the team handling the inquiry endpoint.
  onSubmit?: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    message: string;
    image: File | null;
  }) => Promise<void> | void;
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const DesignerHelpModal: React.FC<DesignerHelpModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be under 10 MB.");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (submitting) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setFirstName("");
    setLastName("");
    setEmail("");
    setContactNumber("");
    setMessage("");
    setImage(null);
    setImagePreview(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your first and last name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email so a designer can reach out.");
      return;
    }
    // Phone is optional; only validate format when the user has typed something.
    if (contactNumber.trim()) {
      const digitsOnly = contactNumber.replace(/\D/g, "");
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        toast.error("Please enter a valid phone number (10-15 digits).");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          contactNumber: contactNumber.trim(),
          message: message.trim(),
          image,
        });
      } else {
        // Stub fallback — no backend hookup yet.
        toast.success(
          "Thanks! A designer will reach out within one business day.",
        );
      }
      handleClose();
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="designer-help-title"
    >
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <div className="px-6 pb-6 pt-8">
          <h2
            id="designer-help-title"
            className="mb-2 text-2xl font-semibold text-gray-900"
          >
            Want to work with a designer?
          </h2>
          <p className="mb-6 text-sm text-gray-600">
            Stuck on a detail or want a designer to take it from here? Send us
            an inspiration image or describe what you have in mind and
            we&apos;ll be in touch.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="designer-help-first-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <input
                  id="designer-help-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label
                  htmlFor="designer-help-last-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <input
                  id="designer-help-last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="designer-help-email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="designer-help-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="designer-help-phone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Phone number (optional)
              </label>
              <input
                id="designer-help-phone"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label
                htmlFor="designer-help-message"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                What would you like our designer to know? (optional)
              </label>
              <textarea
                id="designer-help-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Logo concept, theme, colors, deadlines…"
              />
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Reference image (optional)
              </span>
              {imagePreview ? (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Reference preview"
                    className="h-32 w-32 rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow ring-1 ring-gray-300 hover:bg-gray-100"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-32 w-32 flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
                >
                  <ImagePlus size={24} />
                  <span className="mt-1 text-xs">Attach image</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(",")}
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, or WebP. Up to 10 MB.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ternary"
                onClick={handleClose}
                disabled={submitting}
                type="button"
                width="w-auto"
              >
                Not now
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={submitting}
                width="w-auto"
              >
                {submitting ? "Sending…" : "Talk to a designer"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DesignerHelpModal;
