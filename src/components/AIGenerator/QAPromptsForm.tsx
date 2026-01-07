"use client";
import React, { useEffect } from "react";
import {
  metalFinishesOptions,
  coinStylesOptions,
  detailLevelOptions,
  referenceImageImpactOptions,
  placeholderTexts,
  exampleTexts,
} from "./data";
import { QAFormData, QAPromptsFormProps } from "./types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "../common/input";
import Image from "next/image";
import Button from "../common/button/Button";
import { useAiFlowStore } from "@/src/store/useAiFlowStore";
import {
  useCoinDesignStore,
  useQAPromptsStore,
} from "@/src/store/useCoinStore";

const formSchema = z.object({
  coinShape: z
    .string()
    .min(1, "Coin shape is required")
    .max(50, "Coin shape cannot exceed 50 characters"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(50, "Subject cannot exceed 50 characters"),
  metalFinishes: z
    .string()
    .min(1, "Metal finish is required")
    .max(50, "Metal finish cannot exceed 50 characters"),
  coinStyles: z
    .string()
    .min(1, "Coin style is required")
    .max(50, "Coin style cannot exceed 50 characters"),
  detailLevel: z
    .string()
    .min(1, "Detail level is required")
    .max(50, "Detail level cannot exceed 50 characters"),
  frontDescription: z
    .string()
    .min(1, "Front description is required")
    .max(50, "Front description cannot exceed 50 characters"),
  frontReferenceImage: z.string().min(1, "Front reference image is required"),
  frontReferenceImageImpact: z
    .string()
    .min(1, "Front reference image impact is required")
    .max(50, "Front reference image impact cannot exceed 50 characters"),
  frontTextInsideArtwork: z
    .string()
    .min(1, "Front text inside artwork is required")
    .max(50, "Front text inside artwork cannot exceed 50 characters"),
  frontTextStyle: z
    .string()
    .min(1, "Front text style is required")
    .max(50, "Front text style cannot exceed 50 characters"),
  frontComposition: z
    .string()
    .min(1, "Front composition notes are required")
    .max(50, "Front composition notes cannot exceed 50 characters"),
  backDescription: z
    .string()
    .min(1, "Back description is required")
    .max(50, "Back description cannot exceed 50 characters"),
  backReferenceImage: z.string().min(1, "Back reference image is required"),
  backReferenceImageImpact: z
    .string()
    .min(1, "Back reference image impact is required")
    .max(50, "Back reference image impact cannot exceed 50 characters"),
  backTextInsideArtwork: z
    .string()
    .min(1, "Back text inside artwork is required")
    .max(50, "Back text inside artwork cannot exceed 50 characters"),
  backTextStyle: z
    .string()
    .min(1, "Back text style is required")
    .max(50, "Back text style cannot exceed 50 characters"),
  backComposition: z
    .string()
    .min(1, "Back composition notes are required")
    .max(50, "Back composition notes cannot exceed 50 characters"),
  prohibitedContent: z
    .string()
    .min(1, "Prohibited content is required")
    .max(50, "Prohibited content cannot exceed 50 characters"),
});

export const QAPromptsForm: React.FC<QAPromptsFormProps> = ({
  onSubmit,
  initialData = {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<QAFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coinShape: "",
      subject: "",
      metalFinishes: "",
      coinStyles: "",
      detailLevel: "",
      frontDescription: "",
      frontReferenceImage: "",
      frontReferenceImageImpact: "",
      frontTextInsideArtwork: "",
      frontTextStyle: "",
      frontComposition: "",
      backDescription: "",
      backReferenceImage: "",
      backReferenceImageImpact: "",
      backTextInsideArtwork: "",
      backTextStyle: "",
      backComposition: "",
      prohibitedContent: "",
      ...initialData,
    },
  });

  const { setFormData, setInProgress } = useQAPromptsStore();

  const { goTo } = useAiFlowStore();

  const { front, back } = useCoinDesignStore();
  const frontImageUrl = front.image?.url || "/images/home/front-side.png";
  const backImageUrl = back.image?.url || "/images/home/front-side.png";

  useEffect(() => {
    setValue("frontReferenceImage", frontImageUrl, { shouldValidate: true });
    setValue("backReferenceImage", backImageUrl, { shouldValidate: true });
  }, [frontImageUrl, backImageUrl, setValue]);

  const onFormSubmit = async (data: QAFormData) => {
    // Store complete form data in Zustand (also sets isInProgress to true)
    setFormData(data);

    // Call parent's onSubmit handler
    onSubmit(data);

    // Navigate to ThreeDRender screen
    goTo("threeDRender");
    window.history.pushState(
      { screen: "threeDRender" },
      "",
      window.location.href,
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-primary mb-2 mt-4">
          ANSWER GUIDED Q&A
        </h1>
        <h2 className="text-3xl font-semibold text-primary">PROMPTS</h2>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              1. COIN SHAPE:
            </h3>
            <Input
              {...register("coinShape", {
                onChange: (e) => setFormData({ coinShape: e.target.value }),
              })}
              placeholder={placeholderTexts.coinShape}
              inputSize="md"
              className="border-none py-5 px-6 rounded-xl"
              bg="bg-gray-100"
              error={errors.coinShape?.message}
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              2. SUBJECT:
            </h3>
            <Input
              {...register("subject", {
                onChange: (e) => setFormData({ subject: e.target.value }),
              })}
              textarea
              rows={1}
              placeholder={placeholderTexts.subject}
              inputSize="md"
              className="border-none py-5 px-6 rounded-xl"
              bg="bg-gray-100"
              error={errors.subject?.message}
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              3. METAL FINISHES:
            </h3>
            <Input
              {...register("metalFinishes", {
                onChange: (e) => setFormData({ metalFinishes: e.target.value }),
              })}
              select
              options={metalFinishesOptions}
              placeholder="Select Metal Finishes"
              inputSize="md"
              className="border-none py-5 px-6 rounded-xl"
              bg="bg-gray-100"
              error={errors.metalFinishes?.message}
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              4. COIN STYLES
            </h3>
            <Input
              {...register("coinStyles", {
                onChange: (e) => setFormData({ coinStyles: e.target.value }),
              })}
              select
              options={coinStylesOptions}
              placeholder="Select Coin Style"
              inputSize="md"
              className="border-none py-5 px-6 rounded-xl"
              bg="bg-gray-100"
              error={errors.coinStyles?.message}
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              5. DETAIL LEVEL
            </h3>
            <Input
              {...register("detailLevel", {
                onChange: (e) => setFormData({ detailLevel: e.target.value }),
              })}
              select
              options={detailLevelOptions}
              placeholder="Select Detail Level"
              inputSize="md"
              className="border-none py-5 px-6 rounded-xl"
              bg="bg-gray-100"
              error={errors.detailLevel?.message}
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">FRONT SIDE</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                1. DESCRIPTION
              </h3>
              <Input
                {...register("frontDescription", {
                  onChange: (e) =>
                    setFormData({ frontDescription: e.target.value }),
                })}
                textarea
                rows={4}
                placeholder={placeholderTexts.frontDescription}
                inputSize="md"
                className="border-none py-5 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.frontDescription?.message}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                2. REFERENCE IMAGE
              </h3>
              {frontImageUrl ? (
                <div className="relative w-64 h-64 mx-auto">
                  <Image
                    src={frontImageUrl}
                    alt="Front Reference Preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md border border-gray-300 shadow"
                  />
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Loading front image...
                </div>
              )}
              {errors.frontReferenceImage && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.frontReferenceImage.message}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                3. REFERENCE IMAGE IMPACT
              </h3>
              <Input
                {...register("frontReferenceImageImpact", {
                  onChange: (e) =>
                    setFormData({ frontReferenceImageImpact: e.target.value }),
                })}
                select
                options={referenceImageImpactOptions}
                placeholder="Select Impact"
                inputSize="md"
                className="border-none py-5 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.frontReferenceImageImpact?.message}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                4. TEXT INSIDE ARTWORK
              </h3>
              <Input
                {...register("frontTextInsideArtwork", {
                  onChange: (e) =>
                    setFormData({ frontTextInsideArtwork: e.target.value }),
                })}
                textarea
                rows={4}
                placeholder={placeholderTexts.frontTextInsideArtwork}
                inputSize="md"
                className="border-none py-5 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.frontTextInsideArtwork?.message}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                5. TEXT STYLE
              </h3>
              <Input
                {...register("frontTextStyle", {
                  onChange: (e) =>
                    setFormData({ frontTextStyle: e.target.value }),
                })}
                textarea
                rows={1}
                placeholder={placeholderTexts.frontTextStyle}
                inputSize="md"
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.frontTextStyle?.message}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                6. COMPOSITION NOTES
              </h3>
              <Input
                {...register("frontComposition", {
                  onChange: (e) =>
                    setFormData({ frontComposition: e.target.value }),
                })}
                rows={1}
                placeholder={placeholderTexts.frontCompositionNotes}
                inputSize="md"
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.frontComposition?.message}
              />
              <p className="text-xs text-gray-500 mt-2">
                {exampleTexts.compositionNotes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">BACK SIDE</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                1. DESCRIPTION
              </h3>
              <Input
                {...register("backDescription", {
                  onChange: (e) =>
                    setFormData({ backDescription: e.target.value }),
                })}
                textarea
                rows={4}
                placeholder={placeholderTexts.backDescription}
                inputSize="md"
                className="border-none py-5 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.backDescription?.message}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                2. REFERENCE IMAGE
              </h3>
              {backImageUrl ? (
                <div className="relative w-64 h-64 mx-auto">
                  <Image
                    src={backImageUrl}
                    alt="Back Reference Preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md border border-gray-300 shadow"
                  />
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Loading back image...
                </div>
              )}
              {errors.backReferenceImage && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.backReferenceImage.message}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                3. REFERENCE IMAGE IMPACT
              </h3>
              <Input
                {...register("backReferenceImageImpact", {
                  onChange: (e) =>
                    setFormData({ backReferenceImageImpact: e.target.value }),
                })}
                select
                options={referenceImageImpactOptions}
                placeholder="Select Impact"
                inputSize="md"
                className="border-none py-5 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.backReferenceImageImpact?.message}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                4. TEXT INSIDE ARTWORK
              </h3>
              <Input
                {...register("backTextInsideArtwork", {
                  onChange: (e) =>
                    setFormData({ backTextInsideArtwork: e.target.value }),
                })}
                textarea
                rows={4}
                placeholder={placeholderTexts.backTextInsideArtwork}
                inputSize="md"
                className="border-none py-5 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.backTextInsideArtwork?.message}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                5. TEXT STYLE
              </h3>
              <Input
                {...register("backTextStyle", {
                  onChange: (e) =>
                    setFormData({ backTextStyle: e.target.value }),
                })}
                textarea
                rows={1}
                placeholder={placeholderTexts.backTextStyle}
                inputSize="md"
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.backTextStyle?.message}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                6. COMPOSITION NOTES
              </h3>
              <Input
                {...register("backComposition", {
                  onChange: (e) =>
                    setFormData({ backComposition: e.target.value }),
                })}
                textarea
                rows={1}
                placeholder={placeholderTexts.backCompositionNotes}
                inputSize="md"
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.backComposition?.message}
              />
              <p className="text-xs text-gray-500 mt-2">
                {exampleTexts.compositionNotes}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            PROHIBITED CONTENT
          </h2>
          <Input
            {...register("prohibitedContent", {
              onChange: (e) =>
                setFormData({ prohibitedContent: e.target.value }),
            })}
            rows={1}
            placeholder={placeholderTexts.prohibitedContent}
            inputSize="md"
            className="border-none py-4 px-6 rounded-xl"
            bg="bg-gray-100"
            error={errors.prohibitedContent?.message}
          />
          <p className="text-xs text-gray-500 mt-2">
            {exampleTexts.prohibitedContent}
          </p>
        </div>

        <div className="text-center items-center justify-center flex pt-8">
          <Button
            type="submit"
            variant="primary"
            className="max-w-[250px] text-white px-8 py-4 rounded-full font-medium transition-colors text-sm"
          >
            PROCEED WITH Q&A
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QAPromptsForm;
