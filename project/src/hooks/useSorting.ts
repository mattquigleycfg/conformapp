import { useState, useMemo } from 'react';
import { DisplayDrawingRecord, SortConfig } from '../types';

export const useSorting = (data: DisplayDrawingRecord[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'WIDTH',
    direction: 'ascending'
  });

  const sortedData = useMemo(() => {
    const dataCopy = [...data];
    
    // Always apply default multi-column sorting (Width then Length then Pitch)
    return dataCopy.sort((a, b) => {
      // Primary sort: WIDTH
      const aWidth = a.WIDTH;
      const bWidth = b.WIDTH;
      
      if (aWidth !== bWidth) {
        return sortConfig.direction === 'ascending' ? aWidth - bWidth : bWidth - aWidth;
      }
      
      // Secondary sort: LENGTH (when Width values are equal)
      const aLength = a.LENGTH;
      const bLength = b.LENGTH;
      
      if (aLength !== bLength) {
        return sortConfig.direction === 'ascending' ? aLength - bLength : bLength - aLength;
      }
      
      // Tertiary sort: PITCH (when Width and Length values are equal)
      const aPitch = a.PITCH;
      const bPitch = b.PITCH;
      
      return sortConfig.direction === 'ascending' ? aPitch - bPitch : bPitch - aPitch;
    });
  }, [data, sortConfig]);

  const requestSort = (key: keyof DisplayDrawingRecord) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    // If clicking on WIDTH column (our primary sort), toggle direction
    if (key === 'WIDTH') {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    // For other columns, we'll still use the multi-column sort but change direction
    else if (sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key: 'WIDTH', direction });
  };

  return {
    sortedData,
    sortConfig,
    requestSort
  };
};