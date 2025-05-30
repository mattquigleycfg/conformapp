import React from 'react';
import { Download, ChevronUp, ChevronDown } from 'lucide-react';
import { DrawingRecord, SortConfig, ColumnDefinition } from '../types';
import { motion } from 'framer-motion';

interface DataTableProps {
  data: DrawingRecord[];
  sortConfig: SortConfig;
  onSort: (key: keyof DrawingRecord) => void;
  onViewPdf: (drawingId: string) => void;
}

const columns: ColumnDefinition[] = [
  { key: 'WIDTH', header: 'Width', width: 10 },
  { key: 'LENGTH', header: 'Length', width: 10 },
  { key: 'PITCH', header: 'Pitch', width: 10 },
  { key: 'START_HEIGHT', header: 'Start Height', width: 10 },
  { key: 'BOX_GUTTER', header: 'Box Gutter', width: 10 },
  { key: 'RIDGE', header: 'Ridge', width: 10 },
  { key: 'CAPACITY', header: 'Capacity (kpa)', width: 10 },
  { key: 'SHOP_DRAWING', header: 'Shop Drawing', width: 20 }
];

const DataTable: React.FC<DataTableProps> = ({
  data,
  sortConfig,
  onSort,
  onViewPdf
}) => {
  const getDownloadUrl = (drawingId: string) => {
    const basePath = 'Con-form%20Shared%20Drive/Engineering/15.%20Shop%20Drawings';
    const encodedDrawingId = encodeURIComponent(drawingId);
    return `https://www.dropbox.com/home/${basePath}/${encodedDrawingId}.pdf`;
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ width: `${column.width}%` }}
                onClick={() => onSort(column.key)}
              >
                <div className="flex items-center">
                  {column.header}
                  {sortConfig.key === column.key ? (
                    sortConfig.direction === 'ascending' ? (
                      <ChevronUp size={16} className="ml-1" />
                    ) : (
                      <ChevronDown size={16} className="ml-1" />
                    )
                  ) : null}
                </div>
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-lg">No drawings found</p>
                  <p className="text-sm mt-2">Try adjusting your filters or upload a new drawings list</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <motion.tr
                key={index}
                className="hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {column.key === 'SHOP_DRAWING' ? (
                      <div className="max-w-xs truncate">{String(item[column.key])}</div>
                    ) : (
                      String(item[column.key])
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex space-x-2">
                    <button
                      className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      onClick={() => window.open(getDownloadUrl(item.SHOP_DRAWING), '_blank')}
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;