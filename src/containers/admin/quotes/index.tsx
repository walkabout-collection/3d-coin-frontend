'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { quotesCards, quotesData } from './data';
import { Quote } from './types';
import Search from '@/src/components/common/search';
import SortDropdown from '@/src/components/common/SortDropdown';
import Image from 'next/image';
import Button from '@/src/components/common/button/Button';
import AddQuoteModal from '@/src/components/admin/AddQuoteModal';
import ApproveQuoteModal from '@/src/components/admin/ApproveQuoteModal'; 

const AdminQuotes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [internalSort, setInternalSort] = useState('newest');
  const [sortedDataState, setSortedDataState] = useState<Quote[]>(quotesData);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const sortData = (dataToSort: Quote[], sortValue: string) => {
    if (!sortValue || !dataToSort.length) return dataToSort;

    return [...dataToSort].sort((a, b) => {
      switch (sortValue) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'order_asc':
          return a.orderNo.localeCompare(b.orderNo);
        case 'order_desc':
          return b.orderNo.localeCompare(a.orderNo);
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    setSortedDataState(sortData(quotesData, internalSort));
  }, [internalSort]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedDataState;

    return sortedDataState.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedDataState, searchTerm]);

  const handleSortChange = (sort: string) => {
    setInternalSort(sort);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const viewQuote = (id: number) => {
    console.log(`Viewing quote ${id}`);
  };

  const handleApprove = (id: number) => {
    const quote = filteredData.find((q) => q.id === id);
    if (quote) {
      setSelectedQuote(quote);
      setIsApproveModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    console.log(`Deleting quote ${id}`);
    setSortedDataState((prev) => prev.filter((quote) => quote.id !== id));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleApproveClose = () => {
    setIsApproveModalOpen(false);
    setSelectedQuote(null);
  };

  const handleApproveConfirm = (price: number) => {
    if (selectedQuote) {
      console.log(`Approved quote ${selectedQuote.id} with total price ${price}`);
      setSortedDataState((prev) =>
        prev.map((q) =>
          q.id === selectedQuote.id ? { ...q, label: 'Approved' } : q
        )
      );
    }
    handleApproveClose();
  };

  const sortOptionsDropdown = [
    { value: 'newest', label: 'Newest To Oldest' },
    { value: 'oldest', label: 'Oldest To Newest' },
  ];

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Quotes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {quotesCards.map((card) => (
          <div
            key={card.id}
            className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#1a2a3a] rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                <div className="w-6 h-6 relative">
                  <Image
                    src={card.icon}
                    alt={`${card.title} icon`}
                    fill
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  {card.title}
                </h2>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6 mt-10">
        <Search
          placeholder="SEARCH"
          onSearch={handleSearch}
          variant="primary"
        />
        <div className="flex items-center gap-6">
          <Button
            type="button"
            variant="ternary"
            className="max-w-[140px] rounded-lg text-sm font-semibold !bg-gray-200 border-none"
            onClick={handleOpenModal}
          >
            Add Quote
          </Button>
          <SortDropdown
            options={sortOptionsDropdown}
            value={internalSort}
            onChange={handleSortChange}
            showLabel={true}
            labelText="Sort:"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No quotes found</p>
          </div>
        ) : (
          filteredData.map((quote) => (
            <div
              key={quote.id}
              className="bg-gray-100 p-6 rounded-lg flex justify-between items-center"
            >
              <div className="flex-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-black">Name:</span>
                    <span className="text-sm text-gray-900">{quote.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-black">Order No:</span>
                    <span className="text-sm text-gray-900">{quote.orderNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-black">Email:</span>
                    <span className="text-sm text-gray-900">{quote.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <span className="text-black px-3 py-1 rounded-md text-sm font-semibold bg-gray-200">
                  {quote.label}
                </span>
                <div className="flex gap-2">
                  <button
                    className="p-2 text-xs rounded-full bg-gray-200 cursor-pointer"
                    onClick={() => handleDelete(quote.id)}
                  >
                    <Image src="/images/dashboard/delete.svg" alt="Delete" width={20} height={20} />
                  </button>
                  <button
                    onClick={() => viewQuote(quote.id)}
                    className="px-3 py-2 text-xs rounded-full bg-gray-200 cursor-pointer"
                  >
                    <Image src="/images/dashboard/view-icon.svg" alt="View" width={20} height={20} />
                  </button>
                  <Button
                    variant="primary"
                    className="px-3 py-1 text-xs rounded-full max-w-[140px]"
                    onClick={() => handleApprove(quote.id)}
                  >
                    Add to Order
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && <AddQuoteModal onClose={handleCloseModal} />}
      {isApproveModalOpen && selectedQuote && (
        <ApproveQuoteModal
          quote={selectedQuote}
          onClose={handleApproveClose}
          onApprove={handleApproveConfirm}
        />
      )}
    </div>
  );
};

export default AdminQuotes;