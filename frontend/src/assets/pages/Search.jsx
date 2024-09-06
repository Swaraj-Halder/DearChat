import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    // Debounce the query input
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 3000); // 3000ms delay

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <input 
      type="text" 
      placeholder="Search users by username..." 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

export default SearchBar;
