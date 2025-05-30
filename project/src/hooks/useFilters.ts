import { useState, useMemo } from 'react';
import { DisplayDrawingRecord, FilterState } from '../types';

const INITIAL_FILTER_STATE: FilterState = {
  WIDTH: '',
  LENGTH: '',
  PITCH: '',
  START_HEIGHT: '',
  BOX_GUTTER: '',
  RIDGE: '',
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
      BOX_GUTTER: new Set(),
      RIDGE: new Set(),
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
      acc[key as keyof FilterState] = Array.from(valueSet).sort();
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