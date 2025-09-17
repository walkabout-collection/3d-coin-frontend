'use client';
import React from 'react';
import Image from 'next/image';

interface PackagingModalProps {
  packagingDescription: string;
  onClose: () => void;
  backText: string
}

const PackagingModal: React.FC<PackagingModalProps> = ({ packagingDescription, onClose , backText}) => {
  return (
    <div className="fixed inset-0 border  bg-opacity-50 flex items-center justify-center z-50 mt-20">
      <div className="bg-white rounded-lg p-10 max-w-[851px] max-h-[542px] relative shadow-md ">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <Image src="/images/dashboard/cross-icon.svg" alt="Close" width={14} height={14} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Packaging Description</h2>
        <div className="bg-gray-100 p-2 rounded-lg mb-4">
          <p className=" border-none py-4 px-6 rounded-xl">{packagingDescription}</p>
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-2">Back Text</label>
                  <div className="bg-gray-100 p-2 rounded-lg mb-4">

            <p className=" border-none py-2 px-6 rounded-xl">{backText}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PackagingModal;