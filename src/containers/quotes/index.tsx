'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Quote } from './types';
import Search from '@/src/components/common/search';
import SortDropdown from '@/src/components/common/SortDropdown';
import { Eye } from 'lucide-react';
import { useUserQuotes } from '@/src/hooks/useQueries';

const Quotes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [internalSort, setInternalSort] = useState('newest');
  const [sortedDataState, setSortedDataState] = useState<Quote[] | null>();

  const {data: quotesData, isPending, isError, refetch} = useUserQuotes();
  console.log(quotesData);

 useEffect(() => {
  setSortedDataState(quotesData ?? []);
}, [quotesData]);



  const sortData = (dataToSort: Quote[], sortValue: string) => {
    if (!sortValue || !dataToSort?.length) return dataToSort;

    return [...dataToSort].sort((a, b) => {
      switch (sortValue) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'order_asc':
          return a.orderId!.localeCompare(b.orderId!);
        case 'order_desc':
          return b.orderId!.localeCompare(a.orderId!);
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
  if (quotesData) {
    setSortedDataState(sortData(quotesData, internalSort));
  }
}, [internalSort, quotesData]);


  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedDataState;

    return sortedDataState?.filter((row) =>
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

  const viewQuote = (id: string) => {
    console.log(`Viewing quote ${id}`);
  };

  const sortOptionsDropdown = [
    { value: 'newest', label: 'Newest To Oldest' },
    { value: 'oldest', label: 'Oldest To Newest' },
   
  ];

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Quotes</h1>

      <div className="flex items-center justify-between mb-6">
        <Search
          placeholder="SEARCH"
          onSearch={handleSearch}
          variant="primary"
        />
        <SortDropdown
          options={sortOptionsDropdown}
          value={internalSort}
          onChange={handleSortChange}
          showLabel={true}
          labelText="Sort:"
        />
      </div>

      <div className="space-y-4">
        {filteredData?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No quotes found</p>
          </div>
        ) : (
          filteredData?.map((quote) => (
            <div
              key={quote.id}
              className="bg-gray-100 p-6 rounded-lg flex justify-between items-center"
            >
              <div className="flex-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-black">Name:</span>
                    <span className="text-sm text-gray-900">{quote.user?.firstName + " " + quote.user?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-black">Order No:</span>
                    <span className="text-sm text-gray-900">{quote.orderId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-black">Email:</span>
                    <span className="text-sm text-gray-900">{quote.email ?? quote.user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => viewQuote(quote.id)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                  title="View Quote"
                >
                  <Eye size={22} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Quotes;
