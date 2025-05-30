import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import FileUploader from './FileUploader';
import { uploadFile } from '../utils/dropbox';

interface UploadFormData {
  productType: string;
  screenType: string;
  width: string;
  length: string;
  pitch: string;
  extraDetail: string;
  comments: string;
  folder: 'shop-drawings' | 'packout';
}

const PRODUCT_TYPES = [
  { value: 'MR', label: 'Metal Roof' },
  { value: 'CR', label: 'Concrete Roof' },
  { value: 'ES', label: 'Easy Screen (to roof)' },
  { value: 'LW', label: 'Louvre Wall' },
  { value: 'SD', label: 'Standard Screens' },
  { value: 'SS', label: 'Soundshield' },
  { value: 'A+', label: 'Acoustic+' },
  { value: 'GR', label: 'Guardrail' },
];

const EXTRA_DETAILS = [
  { value: 'OR', label: 'Over Ridge' },
  { value: '5kPa', label: '5kPa' },
];

const FileUploadForm: React.FC = () => {
  const [formData, setFormData] = useState<UploadFormData>({
    productType: '',
    screenType: '',
    width: '',
    length: '',
    pitch: '',
    extraDetail: '',
    comments: '',
    folder: 'shop-drawings',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    try {
      // Generate file name based on metadata
      const fileName = `${formData.productType}-${formData.screenType}-${formData.width}-${formData.length}-${formData.pitch}${formData.extraDetail || ''}.pdf`;
      const path = `/${formData.folder}/${fileName}`;

      await uploadFile(file, path);
      setSuccess('File uploaded successfully!');
      setFile(null);
      
      // Reset form
      setFormData({
        productType: '',
        screenType: '',
        width: '',
        length: '',
        pitch: '',
        extraDetail: '',
        comments: '',
        folder: 'shop-drawings',
      });
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Type</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
              required
            >
              <option value="">Select Product Type</option>
              {PRODUCT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.value} = {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Screen Type</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.screenType}
              onChange={(e) => setFormData({ ...formData, screenType: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Width (mm)</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.width}
              onChange={(e) => setFormData({ ...formData, width: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Length (mm)</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.length}
              onChange={(e) => setFormData({ ...formData, length: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pitch (degrees)</label>
            <input
              type="number"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.pitch}
              onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Extra Detail</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.extraDetail}
              onChange={(e) => setFormData({ ...formData, extraDetail: e.target.value })}
            >
              <option value="">None</option>
              {EXTRA_DETAILS.map((detail) => (
                <option key={detail.value} value={detail.value}>
                  {detail.value} = {detail.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Comments</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Location</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.folder}
              onChange={(e) => setFormData({ ...formData, folder: e.target.value as 'shop-drawings' | 'packout' })}
              required
            >
              <option value="shop-drawings">Shop Drawings</option>
              <option value="packout">Packout</option>
            </select>
          </div>
        </div>

        <FileUploader
          onFileUpload={setFile}
          folder={formData.folder}
        />

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {success && (
          <div className="text-green-600 text-sm">{success}</div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading || !file}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="-ml-1 mr-2 h-5 w-5" />
                Upload File
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUploadForm;