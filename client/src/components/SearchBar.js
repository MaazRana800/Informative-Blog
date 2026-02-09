import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, User, FileText, MessageCircle } from 'lucide-react';
import API_URL from '../config/api';

const SearchBar = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('all');
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load trending searches
    fetchTrendingSearches();
    
    // Handle clicks outside search
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const timer = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchTrendingSearches = async () => {
    try {
      const response = await fetch(`${API_URL}/api/search/trending`);
      const data = await response.json();
      setTrending(data.trending || []);
    } catch (error) {
      console.error('Error fetching trending searches:', error);
    }
  };

  const fetchSuggestions = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, searchType);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    onSearch(suggestion.title, searchType);
  };

  const handleTrendingClick = (trendingItem) => {
    setQuery(trendingItem.query);
    setShowSuggestions(false);
    onSearch(trendingItem.query, searchType);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'post':
        return <FileText size={14} className="text-blue-500" />;
      case 'user':
        return <User size={14} className="text-green-500" />;
      case 'category':
        return <FileText size={14} className="text-purple-500" />;
      default:
        return <Search size={14} className="text-gray-500" />;
    }
  };

  return (
    <div ref={searchRef} className={`search-bar relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search posts, users, categories..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Search Type Selector */}
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="ml-2 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="posts">Posts</option>
            <option value="users">Users</option>
            <option value="categories">Categories</option>
          </select>

          <button
            type="submit"
            className="ml-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : (
            <>
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 text-left transition-colors"
                    >
                      {getIcon(suggestion.type)}
                      <div>
                        <div className="font-medium text-gray-900">{suggestion.title}</div>
                        <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Trending Searches */}
              {trending.length > 0 && (
                <div className="p-2 border-t border-gray-200">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={12} />
                    Trending
                  </div>
                  {trending.slice(0, 5).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(item)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 text-left transition-colors"
                    >
                      <Clock size={14} className="text-gray-400" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.query}</div>
                        <div className="text-xs text-gray-500">{item.count} searches</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {suggestions.length === 0 && trending.length === 0 && query.length >= 2 && (
                <div className="p-4 text-center text-gray-500">
                  <Search size={24} className="mx-auto mb-2 text-gray-300" />
                  <p>No suggestions found</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
