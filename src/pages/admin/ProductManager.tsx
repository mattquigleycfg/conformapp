import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { format } from 'date-fns';
import { Search, Upload, Download, Plus, Edit, Trash2 } from 'lucide-react';
import Papa from 'papaparse';

interface Product {
  id: string;
  part_name: string;
  product_code: string;
  standard_price: number;
  weight: number | null;
  category: string | null;
  comment: string | null;
  date_updated: string | null;
  manufactured_type: string | null;
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        
        setProducts(data || []);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data?.map(p => p.category).filter(Boolean) as string[]));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_code.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle product edit
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };
  
  // Handle product save
  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .upsert({ 
          ...editingProduct,
          date_updated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Refresh products
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
      
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };
  
  // Handle product delete
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      
      // Remove from local state
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  
  // Handle CSV import
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          // Transform data to match our schema
          const productsToImport = results.data.map((row: any) => ({
            part_name: row.part_name,
            product_code: row.product_code,
            standard_price: parseFloat(row.standard_price || '0'),
            weight: row.weight ? parseFloat(row.weight) : null,
            category: row.category || null,
            comment: row.comment || null,
            manufactured_type: row.manufactured_type || null,
            date_updated: new Date().toISOString()
          }));
          
          // Insert into database
          const { error } = await supabase.from('products').upsert(productsToImport);
          if (error) throw error;
          
          // Refresh products
          const { data } = await supabase.from('products').select('*');
          if (data) setProducts(data);
          
          alert(`Successfully imported ${productsToImport.length} products`);
        } catch (error) {
          console.error('Error importing products:', error);
          alert('Error importing products. Check console for details.');
        }
      }
    });
  };
  
  // Export to CSV
  const handleExportCSV = () => {
    const csv = Papa.unparse(products.map(p => ({
      part_name: p.part_name,
      product_code: p.product_code,
      standard_price: p.standard_price,
      weight: p.weight,
      category: p.category,
      comment: p.comment,
      manufactured_type: p.manufactured_type
    })));
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `con-form-products-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading products...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Product Manager</h1>
        
        <div className="flex flex-wrap gap-2 justify-between mb-4">
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <select
              className="border rounded-lg px-4 py-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="btn btn-primary flex items-center gap-1"
              onClick={() => {
                setEditingProduct({
                  id: '',
                  part_name: '',
                  product_code: '',
                  standard_price: 0,
                  weight: null,
                  category: null,
                  comment: null,
                  date_updated: null,
                  manufactured_type: null
                });
                setIsModalOpen(true);
              }}
            >
              <Plus size={16} /> Add Product
            </button>
            
            <label className="btn btn-secondary flex items-center gap-1">
              <Upload size={16} /> Import CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImportCSV}
              />
            </label>
            
            <button 
              className="btn btn-secondary flex items-center gap-1"
              onClick={handleExportCSV}
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Weight</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.product_code}</td>
                <td className="px-6 py-4 text-sm">{product.part_name}</td>
                <td className="px-6 py-4 text-sm">{product.category}</td>
                <td className="px-6 py-4 text-sm text-right">
                  {product.standard_price?.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  {product.weight ? `${product.weight} kg` : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Edit/Create Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct.id ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Code</label>
                <input
                  type="text"
                  value={editingProduct.product_code}
                  onChange={(e) => setEditingProduct({...editingProduct, product_code: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Part Name</label>
                <input
                  type="text"
                  value={editingProduct.part_name}
                  onChange={(e) => setEditingProduct({...editingProduct, part_name: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={editingProduct.category || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Standard Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.standard_price}
                  onChange={(e) => setEditingProduct({...editingProduct, standard_price: parseFloat(e.target.value)})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.weight || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, weight: e.target.value ? parseFloat(e.target.value) : null})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Manufactured Type</label>
                <select
                  value={editingProduct.manufactured_type || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, manufactured_type: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                >
                  <option value="">Select Type</option>
                  <option value="Purchased">Purchased</option>
                  <option value="Turret">Turret</option>
                  <option value="Manual">Manual</option>
                  <option value="Assembled">Assembled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Comment</label>
                <textarea
                  value={editingProduct.comment || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, comment: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProduct(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
