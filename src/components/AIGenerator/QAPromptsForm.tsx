'use client';
import React from 'react';
import {
  metalFinishesOptions,
  coinStylesOptions,
  detailLevelOptions,
  referenceImageImpactOptions,
  placeholderTexts,
  exampleTexts,
} from './data';
import { QAFormData, QAPromptsFormProps } from './types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '../common/input';
import ImageUpload from '../common/imageUpload';
import Button from '../common/button/Button';

const formSchema = z.object({
  coinShape: z.string().min(1, 'Coin shape is required'),
  subject: z.string().min(1, 'Subject is required'),
  metalFinishes: z.string().min(1, 'Metal finish is required'),
  coinStyles: z.string().min(1, 'Coin style is required'),
  detailLevel: z.string().min(1, 'Detail level is required'),
  frontDescription: z.string().min(1, 'Front description is required'),
  frontReferenceImage: z.instanceof(File, { message: 'Front reference image is required' }),
  frontReferenceImageImpact: z.string().min(1, 'Front reference image impact is required'),
  frontTextInsideArtwork: z.string().min(1, 'Front text inside artwork is required'),
  frontTextStyle: z.string().min(1, 'Front text style is required'),
  frontCompositionNotes: z.string().min(1, 'Front composition notes are required'),
  backDescription: z.string().min(1, 'Back description is required'),
  backReferenceImage: z.instanceof(File, { message: 'Back reference image is required' }),
  backReferenceImageImpact: z.string().min(1, 'Back reference image impact is required'),
  backTextInsideArtwork: z.string().min(1, 'Back text inside artwork is required'),
  backTextStyle: z.string().min(1, 'Back text style is required'),
  backCompositionNotes: z.string().min(1, 'Back composition notes are required'),
  prohibitedContent: z.string().min(1, 'Prohibited content is required'),
});

export const QAPromptsForm: React.FC<QAPromptsFormProps> = ({ onSubmit, initialData = {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<QAFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coinShape: '',
      subject: '',
      metalFinishes: '',
      coinStyles: '',
      detailLevel: '',
      frontDescription: '',
      frontReferenceImageImpact: '',
      frontTextInsideArtwork: '',
      frontTextStyle: '',
      frontCompositionNotes: '',
      backDescription: '',
      backReferenceImageImpact: '',
      backTextInsideArtwork: '',
      backTextStyle: '',
      backCompositionNotes: '',
      prohibitedContent: '',
      ...initialData,
    },
  });

  const formData = watch();

  const handleImageChange = (field: 'frontReferenceImage' | 'backReferenceImage', file: File | null) => {
    // console.log(`handleImageChange for ${field}:`, file);
    if (file) {
      setValue(field, file, { shouldValidate: true });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-primary mb-2 mt-4">ANSWER GUIDED Q&A</h1>
        <h2 className="text-3xl font-semibold text-primary">PROMPTS</h2>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">1. COIN SHAPE:</h3>
            <Input
              {...register('coinShape')}
              placeholder={placeholderTexts.coinShape}
              inputSize="md"
              className="border-none py-5 px-6 rounded-xl"
              bg="bg-gray-100"
              error={errors.coinShape?.message}
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">2. SUBJECT:</h3>
            <Input
              {...register('subject')}
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">3. METAL FINISHES:</h3>
            <Input
              {...register('metalFinishes')}
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">4. COIN STYLES</h3>
            <Input
              {...register('coinStyles')}
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">5. DETAIL LEVEL</h3>
            <Input
              {...register('detailLevel')}
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">1. DESCRIPTION</h3>
              <Input
                {...register('frontDescription')}
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">2. REFERENCE IMAGE</h3>
              <ImageUpload
                {...register('frontReferenceImage')}
                onChange={(file) => handleImageChange('frontReferenceImage', file)}
                value={formData.frontReferenceImage}
                className="py-16"
                error={errors.frontReferenceImage?.message}
                id="front-image-upload"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">3. REFERENCE IMAGE IMPACT</h3>
              <Input
                {...register('frontReferenceImageImpact')}
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">4. TEXT INSIDE ARTWORK</h3>
              <Input
                {...register('frontTextInsideArtwork')}
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">5. TEXT STYLE</h3>
              <Input
                {...register('frontTextStyle')}
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">6. COMPOSITION NOTES</h3>
              <Input
                {...register('frontCompositionNotes')}
                rows={1}
                placeholder={placeholderTexts.frontCompositionNotes}
                inputSize="md"
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.frontCompositionNotes?.message}
              />
              <p className="text-xs text-gray-500 mt-2">{exampleTexts.compositionNotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">BACK SIDE</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">1. DESCRIPTION</h3>
              <Input
                {...register('backDescription')}
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">2. REFERENCE IMAGE</h3>
              <ImageUpload
                {...register('backReferenceImage')}
                onChange={(file) => handleImageChange('backReferenceImage', file)}
                value={formData.backReferenceImage}
                className="py-16"
                error={errors.backReferenceImage?.message}
                id="back-image-upload"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">3. REFERENCE IMAGE IMPACT</h3>
              <Input
                {...register('backReferenceImageImpact')}
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">4. TEXT INSIDE ARTWORK</h3>
              <Input
                {...register('backTextInsideArtwork')}
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">5. TEXT STYLE</h3>
              <Input
                {...register('backTextStyle')}
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">6. COMPOSITION NOTES</h3>
              <Input
                {...register('backCompositionNotes')}
                textarea
                rows={1}
                placeholder={placeholderTexts.backCompositionNotes}
                inputSize="md"
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                error={errors.backCompositionNotes?.message}
              />
              <p className="text-xs text-gray-500 mt-2">{exampleTexts.compositionNotes}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">PROHIBITED CONTENT</h2>
          <Input
            {...register('prohibitedContent')}
            rows={1}
            placeholder={placeholderTexts.prohibitedContent}
            inputSize="md"
            className="border-none py-4 px-6 rounded-xl"
            bg="bg-gray-100"
            error={errors.prohibitedContent?.message}
          />
          <p className="text-xs text-gray-500 mt-2">{exampleTexts.prohibitedContent}</p>
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