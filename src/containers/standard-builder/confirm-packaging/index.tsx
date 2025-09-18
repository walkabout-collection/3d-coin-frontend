'use client';
import Button from '@/src/components/common/button/Button';
import React from 'react';
import { useRouter } from 'next/navigation';

const ConfirmPackaging = () => {
  const router = useRouter();

  const handleNoClick = () => {
    router.push('/design-summary');
  };

  const handleYesClick = () => {
    router.push('/standard-builder/packaging');
  };

  return (
    <div className="min-h-screen">
      <div className="py-8">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-4xl font-bold text-gray-800 mt-28">
            Retail Packaging?
          </h1>
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-lg mx-auto mt-14">
            <Button
              type="button"
              variant="ternary"
              className="!bg-gray-100 border-none font-medium py-6 px-6 rounded-lg hover:border-amber-500 hover:border-2 hover:bg-white hover:shadow-amber-400 hover:shadow-sm text-center"
              onClick={handleNoClick}
            >
              <div className="text-lg leading-tight">
                No
              </div>
            </Button>
            <Button
              type="button"
              variant="ternary"
              className="!bg-gray-100 border-none font-medium py-5 px-6 rounded-lg hover:border-amber-400 hover:border-2 hover:shadow-amber-400 hover:shadow-sm text-center"
              onClick={handleYesClick}
            >
              <div className="text-lg leading-tight">
                Yes
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPackaging;