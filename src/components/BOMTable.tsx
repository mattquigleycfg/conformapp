import React from 'react';
import { BOMItem } from '../services/bomService';

interface BOMTableProps {
  items: BOMItem[];
  showTotals?: boolean;
}

// Helper function to format numbers
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Helper function to format currency
const formatCurrency = (num: number): string => {
  return num.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
};

export const BOMTable: React.FC<BOMTableProps> = ({ items, showTotals = true }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.itemNo}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{item.itemNo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.productCode}</td>
              <td className="px-6 py-4 text-sm">{item.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{formatNumber(item.quantity)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{item.unit}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">{formatCurrency(item.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
        {showTotals && (
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={6} className="px-6 py-4 text-right font-medium">Total:</td>
              <td className="px-6 py-4 text-right font-bold">
                {formatCurrency(items.reduce((sum, item) => sum + item.totalPrice, 0))}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};
