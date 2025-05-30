import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  items: {
    label: string;
    href?: string;
  }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex\" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight size={16} className="mx-2 text-gray-400" />
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-sm font-medium text-gray-800">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;