'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/src/components/common/input';
import Button from '@/src/components/common/button/Button';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits').max(15, 'Contact number too long'),
  changePassword: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

const AdminAccountSetting: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      changePassword: '',
    },
  });



  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    reset();
  };

return (
   <div className=" max-w-2xl min-h-screen mb-20">
      <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
      <p className="text-gray-600 font-semibold mb-6">USER ID: 12345 </p>


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
            labelClassName="text-md !font-semibold text-gray-900"
          />
          <Input
            label="Last Name"
            placeholder="Last Name"
            inputSize="md"
            {...register('lastName')}
            error={errors.lastName?.message}
            className="border-none py-4 px-6 rounded-xl"
            bg="bg-gray-100"
            labelClassName="text-md !font-semibold text-gray-900"
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
          labelClassName="text-md !font-semibold text-gray-900"
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
          labelClassName="text-md !font-semibold text-gray-900"
        />
       <Input
            label="CHANGE PASSWORD"
            placeholder="************"
            type="password"
            inputSize="md"
            {...register('changePassword')}
            error={errors.changePassword?.message}
          className="border-none py-4 px-6 rounded-xl"
          bg="bg-gray-100"
          labelClassName="text-md !font-semibold text-gray-900"
        />
       
        <Button
          type="submit"
          variant="primary"
          className="max-w-[100px]  rounded-full py-3 font-semibold mt-6 mb-20"
        >
          Save      
            </Button>
      </form>
    </div>
  );
};


export default AdminAccountSetting;