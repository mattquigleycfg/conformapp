import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '../types';
import { motion } from 'framer-motion';

interface FilterBarProps {
  filters: FilterState;
  filterOptions: Record<keyof FilterState, string[]>;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white shadow-sm rounded-lg mb-6">
      {/* Search bar */}
      <div className="flex items-center p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by drawing number..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.SHOP_DRAWING}
            onChange={(e) => onFilterChange('SHOP_DRAWING', e.target.value)}
          />
        </div>
        
        <button 
          className={`ml-3 p-2 rounded-lg flex items-center transition-colors ${isExpanded ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <SlidersHorizontal size={20} />
          <span className="ml-2 hidden sm:inline">Filters</span>
        </button>
        
        <button
          className={`ml-3 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            hasActiveFilters 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
          onClick={hasActiveFilters ? onClearFilters : undefined}
          disabled={!hasActiveFilters}
        >
          <X size={20} />
          <span className="hidden sm:inline font-medium">Clear All</span>
        </button>
      </div>
      
      {/* Advanced filters */}
      {isExpanded && (
        <motion.div 
          className="p-4 border-t border-gray-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Width</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.WIDTH}
                onChange={(e) => onFilterChange('WIDTH', e.target.value)}
              >
                <option value="">All Widths</option>
                {filterOptions.WIDTH.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Length</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.LENGTH}
                onChange={(e) => onFilterChange('LENGTH', e.target.value)}
              >
                <option value="">All Lengths</option>
                {filterOptions.LENGTH.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pitch</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.PITCH}
                onChange={(e) => onFilterChange('PITCH', e.target.value)}
              >
                <option value="">All Pitches</option>
                {filterOptions.PITCH.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Start Height</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.START_HEIGHT}
                onChange={(e) => onFilterChange('START_HEIGHT', e.target.value)}
              >
                <option value="">All Start Heights</option>
                {filterOptions.START_HEIGHT.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.CAPACITY}
                onChange={(e) => onFilterChange('CAPACITY', e.target.value)}
              >
                <option value="">All Capacities</option>
                {filterOptions.CAPACITY.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Clear All Filters Button in expanded section */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 font-medium"
                onClick={onClearFilters}
              >
                <X size={18} />
                Clear All Filters
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FilterBar;