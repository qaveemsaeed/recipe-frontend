import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Utensils, Clock } from 'lucide-react';
import { createApiUrl, API_ENDPOINTS } from '../config/api';

const SearchField = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        axios
          .get(`${createApiUrl(API_ENDPOINTS.SEARCH)}?q=${encodeURIComponent(query)}`)
          .then((res) => {
            setResults(res.data || []);
            setShowResults(true);
          })
          .catch(() => {
            setResults([]);
            setShowResults(false);
          });
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for recipes, ingredients, or cuisines..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 pl-12 pr-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 shadow-lg"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {results.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              onClick={handleResultClick}
              className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Utensils className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {recipe.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {recipe.description || 'Delicious recipe'}
                </p>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">
                    {recipe.cookingTime || '30'} min
                  </span>
                  {recipe.price && (
                    <span className="ml-3 text-sm font-semibold text-orange-600">
                      Rs. {recipe.price}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {showResults && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 text-center z-50">
          <div className="text-gray-400 text-4xl mb-2">🔍</div>
          <p className="text-gray-600 font-medium">No recipes found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try searching for different keywords
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchField;