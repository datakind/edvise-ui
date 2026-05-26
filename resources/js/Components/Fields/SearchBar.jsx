import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-6 flex items-center">
      <MagnifyingGlassIcon className="text-gray mr-2 h-4 w-4" />
      <input
        type="text"
        placeholder="Search..."
        className="border-gray-light w-full items-center rounded-full border px-4 py-2"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
