'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '../../common/input';
import Button from '../../common/button/Button';
import ImageUpload from '../../common/imageUpload';
import Image from 'next/image';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits').max(15, 'Contact number too long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  image: z.instanceof(File, { message: 'Image is required' }),
});

type FormData = z.infer<typeof formSchema>;

interface AddQuoteModalProps {
  onClose: () => void;
}

const AddQuoteModal: React.FC<AddQuoteModalProps> = ({ onClose }) => {
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
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    reset();
    onClose(); 
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setValue('image', file, { shouldValidate: true });
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 mt-20">
      <div className="bg-white rounded-lg p-10 max-w-6xl max-h-[542px] relative shadow-md overflow-y-auto">
         <button
                  onClick={onClose}
                  className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <Image src="/images/dashboard/cross-icon.svg" alt="Close" width={14} height={14} />
                </button>
       

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="First Name"
              inputSize="md"
              {...register('firstName')}
              error={errors.firstName?.message}
              className="border-none py-4 px-6 rounded-xl"
              bg="bg-gray-100"
              labelClassName="text-md font-semibold text-gray-900"
            />
            <Input
              label="Last Name"
              placeholder="Last Name"
              inputSize="md"
              {...register('lastName')}
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
            {...register('email')}
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
            {...register('contactNumber')}
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
            {...register('description')}
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
            value={watch('image')}
            error={errors.image?.message}
            id="design-image-upload"
          />
          <Button
            type="submit"
            variant="primary"
            className="max-w-[160px] rounded-full py-3 font-semibold mt-6"
          >
            Add Quote
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddQuoteModal;