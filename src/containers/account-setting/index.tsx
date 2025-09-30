// 'use client';
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import Input from '@/src/components/common/input';
// import Button from '@/src/components/common/button/Button';

// const formSchema = z.object({
//   firstName: z.string().min(1, 'First name is required'),
//   lastName: z.string().min(1, 'Last name is required'),
//   email: z.string().email('Invalid email address').min(1, 'Email is required'),
//   contactNumber: z.string().min(10, 'Contact number must be at least 10 digits').max(15, 'Contact number too long'),
//   changePassword: z.string().min(6, 'Password must be at least 6 characters'),
// });

// type FormData = z.infer<typeof formSchema>;

// const AccountSetting: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       contactNumber: '',
//       changePassword: '',
//     },
//   });



//   const onSubmit = (data: FormData) => {
//     console.log('Form Data:', data);
//     reset();
//   };

// return (
//    <div className=" max-w-2xl min-h-screen mb-20">
//       <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
//       <p className="text-gray-600 font-semibold mb-6">USER ID: 12345 </p>


//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
//         <div className="grid grid-cols-2 gap-4">
//           <Input
//             label="First Name"
//             placeholder="First Name"
//             inputSize="md"
//             {...register('firstName')}
//             error={errors.firstName?.message}
//             className="border-none py-4 px-6 rounded-xl"
//             bg="bg-gray-100"
//             labelClassName="text-md !font-semibold text-gray-900"
//           />
//           <Input
//             label="Last Name"
//             placeholder="Last Name"
//             inputSize="md"
//             {...register('lastName')}
//             error={errors.lastName?.message}
//             className="border-none py-4 px-6 rounded-xl"
//             bg="bg-gray-100"
//             labelClassName="text-md !font-semibold text-gray-900"
//           />
//         </div>
//         <Input
//           label="Email"
//           placeholder="Email"
//           type="email"
//           inputSize="md"
//           {...register('email')}
//           error={errors.email?.message}
//           className="border-none py-4 px-6 rounded-xl"
//           bg="bg-gray-100"
//           labelClassName="text-md !font-semibold text-gray-900"
//         />
        
//        <Input
//             label="CHANGE PASSWORD"
//             placeholder="************"
//             type="password"
//             inputSize="md"
//             {...register('changePassword')}
//             error={errors.changePassword?.message}
//           className="border-none py-4 px-6 rounded-xl"
//           bg="bg-gray-100"
//           labelClassName="text-md !font-semibold text-gray-900"
//         />
//        <Input
//           label="Contact Number"
//           placeholder="Contact Number"
//           type="tel"
//           inputSize="md"
//           {...register('contactNumber')}
//           error={errors.contactNumber?.message}
//           className="border-none py-4 px-6 rounded-xl"
//           bg="bg-gray-100"
//           labelClassName="text-md !font-semibold text-gray-900"
//         />
//         <Button
//           type="submit"
//           variant="primary"
//           className="max-w-[100px]  rounded-full py-3 font-semibold mt-6 mb-20"
//         >
//           Save      
//             </Button>
//       </form>
//     </div>
//   );
// };


// export default AccountSetting;


'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/src/components/common/input';
import Button from '@/src/components/common/button/Button';

// Account Settings Schema
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  contactNumber: z
    .string()
    .min(10, 'Contact number must be at least 10 digits')
    .max(15, 'Contact number too long'),
});

type FormData = z.infer<typeof formSchema>;

// Password Reset Schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const AccountSetting: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Main Form
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
    },
  });

  // Password Modal Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    reset();
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log('Password Reset:', data);
    resetPasswordForm();
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-2xl min-h-screen mb-20">
      <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
      <p className="text-gray-600 font-semibold mb-6">USER ID: 12345 </p>

      {/* Main Form */}
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

        {/* Change Password Button */}
        <div>
          <label className="text-md font-semibold text-gray-900">Password</label>
          <Button
            type="button"
            variant="secondary"
            className="mt-2 py-2 px-6 rounded-full max-w-[280px]"
            onClick={() => setIsModalOpen(true)}
          >
            Change Password
          </Button>
        </div>

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

        <Button
          type="submit"
          variant="primary"
          className="max-w-[100px] rounded-full py-3 font-semibold mt-6 mb-20"
        >
          Save
        </Button>
      </form>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6">Change Password</h3>
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <Input
                label="Current Password"
                placeholder="********"
                type="password"
                {...registerPassword('currentPassword')}
                error={passwordErrors.currentPassword?.message}
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                labelClassName="text-md !font-semibold text-gray-900"
              />
              <Input
                label="New Password"
                placeholder="********"
                type="password"
                {...registerPassword('newPassword')}
                error={passwordErrors.newPassword?.message}
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                labelClassName="text-md !font-semibold text-gray-900"
              />
              <Input
                label="Confirm Password"
                placeholder="********"
                type="password"
                {...registerPassword('confirmPassword')}
                error={passwordErrors.confirmPassword?.message}
                className="border-none py-4 px-6 rounded-xl"
                bg="bg-gray-100"
                labelClassName="text-md !font-semibold text-gray-900"
              />

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-full px-5 py-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="rounded-full px-5 py-2"
                >
                  Reset Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSetting;
