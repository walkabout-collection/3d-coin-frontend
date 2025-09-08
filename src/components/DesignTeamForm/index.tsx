'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Image from 'next/image';
import Input from '../common/input';
import Button from '../common/button/Button';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits').max(15, 'Contact number too long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  image: z.any().optional(), 
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
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      description: '',
      image: null,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
  
    alert('Form submitted! Check console for data.');
    reset();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValue('image', file || null);
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
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            placeholder="Last Name"
            inputSize="md"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>
        <Input
          label="Email"
          placeholder="Email"
          type="email"
          inputSize="md"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Contact Number"
          placeholder="Contact Number"
          type="tel"
          inputSize="md"
          {...register('contactNumber')}
          error={errors.contactNumber?.message}
        />
        <Input
          label="Describe your coin in detail"
          placeholder="Describe your coin in detail..."
          inputSize="lg"
          textarea={true}
          rows={4}
          {...register('description')}
          error={errors.description?.message}
        />
        <div className="flex justify-center my-2 items-center">
          <div className="border-t border-gray-500  w-full"></div>
          <div className="px-4 text-md text-center font-medium text-gray-500 bg-white">
            AND/OR
          </div>
          <div className="border-t border-gray-500  w-full"></div>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-normal text-gray-700">
            Add a design preference image
          </label>
          <div className="border  border-gray-300 rounded-lg p-8 text-center bg-gray-100 hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <Image
                  src="/images/home/upload-icon.svg" 
                  alt="Upload"
                  width={48}
                  height={48}
                  className="mb-2 opacity-50"
                />
                <p className="text-sm text-gray-500 mb-1">Upload Image</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
              </div>
            </label>
            {watch('image') && (
              <p className="mt-2 text-sm text-green-600">
                Image selected: {(watch('image') as File)?.name}
              </p>
            )}
          </div>
          {errors.image && (
            <div className="mt-1 text-red-500 text-sm">
             <span>{errors.image.message as string}</span>
            </div>
          )}
        </div>
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