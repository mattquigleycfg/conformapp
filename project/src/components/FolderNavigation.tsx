import React from 'react';
import { Folder } from 'lucide-react';
import { motion } from 'framer-motion';

interface FolderNavigationProps {
  folders: string[];
  currentFolder: string;
  onFolderSelect: (folder: string) => void;
}

const FolderNavigation: React.FC<FolderNavigationProps> = ({
  folders,
  currentFolder,
  onFolderSelect
}) => {
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-light text-gray-800 mb-4">Folders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders.map((folder, index) => (
          <motion.button
            key={folder}
            className={`flex items-center p-4 rounded-lg transition-all ${
              currentFolder === folder
                ? 'bg-primary-50 border-2 border-primary-500 shadow-sm'
                : 'bg-white border-2 border-gray-200 hover:border-primary-300 hover:shadow-sm'
            }`}
            onClick={() => onFolderSelect(folder)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Folder
              size={20}
              className={currentFolder === folder ? 'text-primary-500' : 'text-gray-400'}
            />
            <span
              className={`ml-3 font-medium ${
                currentFolder === folder ? 'text-primary-700' : 'text-gray-700'
              }`}
            >
              {folder}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FolderNavigation;