"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Ruler, Layers, Square, Type, Palette, Check } from "lucide-react";
import { Step } from "@/src/containers/standard-builder/dimensions/types";
import {
  initialSteps,
  updateStepsBasedOnPath,
} from "@/src/containers/standard-builder/dimensions/data";
import { useStandardBuilderStore } from "@/src/store/useStandardBuilderStore";
import { useInactivityTimer } from "@/src/hooks/useInactivityTimer";
import DesignerHelpModal from "@/src/components/DesignerHelpModal";
import { useCreateContact } from "@/src/hooks/useQueries";
import { uploadBase64ToS3 } from "@/src/services/apiServices";
import { toast } from "react-toastify";

// Show the "Want to work with a designer?" modal after this many ms of
// inactivity on any standard-builder page. Per design feedback: 180 seconds.
const DESIGNER_HELP_INACTIVITY_MS = 180_000;

const iconMap = {
  ruler: Ruler,
  layers: Layers,
  square: Square,
  type: Type,
  palette: Palette,
};

const StandardBuilderLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const router = useRouter();
  const pathname = usePathname();
  const { reset, currentDraftId } = useStandardBuilderStore();
  const hasInitializedRef = useRef(false);
  const previousPathnameRef = useRef<string | null>(null);

  // Designer-help nudge: open the modal after 180s of inactivity. Once the
  // user dismisses or submits, the modal stays closed for the rest of the
  // session (the hook is in `once` mode, so it does not rearm).
  const [designerHelpOpen, setDesignerHelpOpen] = useState(false);
  const { isInactive: shouldOfferDesignerHelp } = useInactivityTimer({
    timeoutMs: DESIGNER_HELP_INACTIVITY_MS,
    once: true,
  });

  useEffect(() => {
    if (shouldOfferDesignerHelp) setDesignerHelpOpen(true);
  }, [shouldOfferDesignerHelp]);

  const { mutateAsync: createContactMutation } = useCreateContact();

  // Submit handler reuses the existing /contact/create endpoint that the
  // DesignTeamForm already wires to. Image (if any) is uploaded to S3 first
  // and the resulting URL is sent as the `image` field. The modal's
  // free-form `message` becomes the contact `description`.
  const handleDesignerHelpSubmit = async ({
    firstName,
    lastName,
    email,
    contactNumber,
    message,
    image,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    message: string;
    image: File | null;
  }) => {
    let imageUrl: string | undefined;
    let imageUploadFailed = false;

    if (image) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") resolve(reader.result);
            else reject(new Error("Failed to read image"));
          };
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
        const ext = image.name.split(".").pop() || "png";
        imageUrl = await uploadBase64ToS3(
          base64,
          `designer-help-${Date.now()}.${ext}`,
        );
      } catch (err) {
        // S3 upload failed (e.g. network error reaching /s3/upload-url).
        // Fall through and submit the inquiry without an image rather than
        // losing the customer's contact request entirely.
        console.error("[DesignerHelp] Image upload failed:", err);
        imageUploadFailed = true;
      }
    }

    await createContactMutation({
      firstName,
      lastName,
      email,
      // Backend requires contactNumber; modal makes it optional. Send a
      // placeholder when blank so the request validates.
      contactNumber: contactNumber.trim() || "N/A",
      description:
        message || "Customer requested designer help from the coin builder.",
      image: imageUrl,
    });

    if (imageUploadFailed) {
      toast.warning(
        "Inquiry sent, but we couldn't attach your image. A designer will reach out — please reply to their email with the image.",
      );
    } else {
      toast.success(
        "Thanks! A designer will reach out within one business day.",
      );
    }
  };

  useEffect(() => {
    if (previousPathnameRef.current === null) {
      if (pathname === "/standard-builder" && !currentDraftId) {
        // Check if we're editing from Design Summary (preserve store data)
        const isEditingFromSummary =
          typeof window !== "undefined" &&
          sessionStorage.getItem("editing-from-design-summary") === "true";

        if (!isEditingFromSummary) {
          try {
            localStorage.removeItem("standard-builder-storage");
          } catch (error) {
            console.warn(
              "[Standard Builder] Failed to clear localStorage:",
              error,
            );
          }
          reset();
          hasInitializedRef.current = true;
          console.log(
            "[Standard Builder] Store reset - starting fresh (first mount)",
          );
        } else {
          // Clear the flag after using it
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("editing-from-design-summary");
          }
          console.log(
            "[Standard Builder] Preserving store data - editing from Design Summary",
          );
          hasInitializedRef.current = true;
        }
      }
      previousPathnameRef.current = pathname;
      return;
    }

    const isEnteringFromOutside =
      !previousPathnameRef.current.startsWith("/standard-builder") &&
      pathname.startsWith("/standard-builder");

    if (isEnteringFromOutside && !currentDraftId) {
      // Check if we're editing from Design Summary (preserve store data)
      const isEditingFromSummary =
        typeof window !== "undefined" &&
        sessionStorage.getItem("editing-from-design-summary") === "true";

      if (!isEditingFromSummary) {
        try {
          localStorage.removeItem("standard-builder-storage");
        } catch (error) {
          console.warn(
            "[Standard Builder] Failed to clear localStorage:",
            error,
          );
        }
        reset();
        hasInitializedRef.current = true;
        console.log(
          "[Standard Builder] Store reset - starting fresh (entering from outside)",
        );
      } else {
        // Clear the flag after using it
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("editing-from-design-summary");
        }
        console.log(
          "[Standard Builder] Preserving store data - editing from Design Summary",
        );
        hasInitializedRef.current = true;
      }
    } else if (pathname.startsWith("/standard-builder")) {
      hasInitializedRef.current = true;
    }

    previousPathnameRef.current = pathname;
  }, [pathname, reset, currentDraftId]);

  useEffect(() => {
    const updatedSteps = updateStepsBasedOnPath(pathname, initialSteps);
    setSteps(updatedSteps);
  }, [pathname]);

  const handleStepClick = (stepId: string, path: string) => {
    router.push(path);
  };

  const getStepClasses = (step: Step) => {
    if (step.completed) {
      return "bg-primary text-white";
    } else if (step.active) {
      return "bg-primary text-black";
    } else {
      return "bg-gray-200 text-black";
    }
  };

  const getIconColor = (step: Step) => {
    if (step.completed) {
      return "text-white";
    } else if (step.active) {
      return "text-yellow-500";
    } else {
      return "text-gray-600";
    }
  };

  const getProgressLineWidth = () => {
    const activeIndex = steps.findIndex((step) => step.active);
    const completedCount = steps.filter((step) => step.completed).length;

    if (activeIndex === -1) return 0;

    const totalSteps = steps.length;
    const stepWidth = 100 / (totalSteps - 1);
    if (steps[activeIndex] && !steps[activeIndex].completed) {
      return completedCount * stepWidth + stepWidth / 2;
    }

    return completedCount * stepWidth;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex px-4">
        <div className="flex py-6 border-b border-gray-200 w-full relative">
          {/* Progress Line */}
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-gray-700 transition-all duration-500 ease-out"
            style={{ width: `${getProgressLineWidth()}%` }}
          ></div>

          <div className="flex w-full justify-around items-start">
            {steps.map((step) => {
              const IconComponent = step.completed
                ? Check
                : iconMap[step.icon as keyof typeof iconMap];

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center space-y-6"
                >
                  <button
                    onClick={() => handleStepClick(step.id, step.path)}
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      transition-all duration-300 ease-in-out
                      hover:scale-105 focus:outline-none
                      ${getStepClasses(step)}
                    `}
                    disabled={!step.active && !step.completed}
                    aria-label={`Go to ${step.title}`}
                    aria-current={step.active ? "step" : undefined}
                  >
                    <IconComponent
                      size={32}
                      className={`${getIconColor(step)} transition-colors duration-300`}
                    />
                  </button>

                  <span
                    className={`
                    text-base font-semibold tracking-wide text-center
                    ${
                      step.active
                        ? "text-yellow-600"
                        : step.completed
                          ? "text-primary"
                          : "text-primary"
                    }
                    transition-colors duration-300
                  `}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 bg-white">
        <main className="flex-grow p-6">{children}</main>
      </div>

      <DesignerHelpModal
        isOpen={designerHelpOpen}
        onClose={() => setDesignerHelpOpen(false)}
        onSubmit={handleDesignerHelpSubmit}
      />
    </div>
  );
};

export default StandardBuilderLayout;
