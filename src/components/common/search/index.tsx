"use client";
import { useState, forwardRef, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react"; 
import Button from "../button/Button";
import { SearchProps } from "./types";

const Search = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      placeholder = "Search...",
      onSearch,
      onChange,
      value,
      className = "",
      inputSize = "md",
      variant = "primary",
      rounded = true,
      ...props
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState(value || "");
       useEffect(() => {
      if (searchValue === "" && onSearch) {
        onSearch("");
      }
    }, [searchValue, onSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchValue(newValue);

      if (onChange) {
        onChange(e);
      }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchValue); 
      }
    };

    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    };

    const combinedStyles = `
      w-full font-medium text-gray-900 placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500
      transition-colors py-2 max-w-[900px]
      ${rounded ? "rounded-full" : "rounded-md"}
      ${sizeStyles[inputSize]}
      ${className}
    `;

    return (
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-2 w-fit"
      >
        {/* Input */}
        <div className="relative">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            ref={ref}
            type="search"
            value={value !== undefined ? value : searchValue}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className={`pl-10 bg-gray-100 border-none max-w-[00px] ${combinedStyles}`}
            {...props}
          />
        </div>

        {/* Button */}
        <Button
          type="submit"
          variant={variant}
          className="rounded-full max-w-[90px] px-6 text-sm py-2"
        >
          Search
        </Button>
      </form>
    );
  }
);

Search.displayName = "Search";
export default Search;
