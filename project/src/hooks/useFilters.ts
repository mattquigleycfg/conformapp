import { useState, useMemo } from 'react';
import { DisplayDrawingRecord, FilterState } from '../types';

const INITIAL_FILTER_STATE: FilterState = {
  WIDTH: '',
  LENGTH: '',
  PITCH: '',
  START_HEIGHT: '',
  CAPACITY: '',
  SHOP_DRAWING: ''
};

export const useFilters = (data: DisplayDrawingRecord[]) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Check if item matches all active filters
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // Skip empty filters
        
        const itemKey = key as keyof DisplayDrawingRecord;
        const itemValue = String(item[itemKey]).toLowerCase();
        const filterValue = value.toLowerCase();
        
        return itemValue.includes(filterValue);
      });
    });
  }, [data, filters]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTER_STATE);
  };

  // Get unique values for each filter field to use in dropdowns
  const filterOptions = useMemo(() => {
    const options: Record<keyof FilterState, Set<string>> = {
      WIDTH: new Set(),
      LENGTH: new Set(),
      PITCH: new Set(),
      START_HEIGHT: new Set(),
      CAPACITY: new Set(),
      SHOP_DRAWING: new Set()
    };

    data.forEach(item => {
      Object.keys(options).forEach(key => {
        const typedKey = key as keyof FilterState;
        options[typedKey].add(String(item[typedKey]));
      });
    });

    // Convert Sets to sorted arrays
    return Object.entries(options).reduce((acc, [key, valueSet]) => {
      const sortedValues = Array.from(valueSet).sort((a, b) => {
        // For numerical fields (WIDTH, LENGTH, PITCH), sort numerically
        if (key === 'WIDTH' || key === 'LENGTH' || key === 'PITCH') {
          const numA = parseFloat(a);
          const numB = parseFloat(b);
          // If both values are valid numbers, sort numerically
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          // If one or both are not numbers, fall back to string sorting
          return a.localeCompare(b);
        }
        // For other fields, use default string sorting
        return a.localeCompare(b);
      });
      acc[key as keyof FilterState] = sortedValues;
      return acc;
    }, {} as Record<keyof FilterState, string[]>);
  }, [data]);

  return {
    filters,
    filteredData,
    updateFilter,
    clearFilters,
    filterOptions
  };
};