import { useState, useMemo } from 'react';
import { DisplayDrawingRecord, SortConfig } from '../types';

export const useSorting = (data: DisplayDrawingRecord[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending'
  });

  const sortedData = useMemo(() => {
    const dataCopy = [...data];
    if (!sortConfig.key) return dataCopy;

    return dataCopy.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof DisplayDrawingRecord];
      const bValue = b[sortConfig.key as keyof DisplayDrawingRecord];

      // Handle numeric vs string comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'ascending'
          ? aValue - bValue
          : bValue - aValue;
      }

      // For string comparison
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (sortConfig.direction === 'ascending') {
        return aString.localeCompare(bString);
      } else {
        return bString.localeCompare(aString);
      }
    });
  }, [data, sortConfig]);

  const requestSort = (key: keyof DisplayDrawingRecord) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  return {
    sortedData,
    sortConfig,
    requestSort
  };
};