import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Atta & Flours',
    stock: '',
  });

  // Local files state (maximum 6 total)
  const [newImageFiles, setNewImageFiles] = useState([]); // Array of File objects
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Array of ObjectURLs
  const [existingImages, setExistingImages] = useState([]); // Array of current product image objects

  const fileInputRef = useRef(null);

  const categories = [
    'Atta & Flours',
    'Cooking Oils',
    'Biscuits & Snacks',
    'Dals & Pulses',
    'Household Essentials',
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalAllowed = 6 - existingImages.length - newImageFiles.length;

    if (files.length > totalAllowed) {
      alert(`You can only upload up to 6 total images. You have room for ${totalAllowed} more.`);
    }

    const selectedFiles = files.slice(0, totalAllowed);
    
    // Create preview URLs
    const previews = selectedFiles.map(file => URL.createObjectURL(file));

    setNewImageFiles(prev => [...prev, ...selectedFiles]);
    setNewImagePreviews(prev => [...prev, ...previews]);

    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveNewImage = (index) => {
    // Revoke object URL
    URL.revokeObjectURL(newImagePreviews[index]);
    
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Atta & Flours',
      stock: '',
    });
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setExistingImages([]);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setExistingImages(product.images || []);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product', error);
        alert(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    const dataPayload = new FormData();
    dataPayload.append('name', formData.name);
    dataPayload.append('description', formData.description);
    dataPayload.append('price', formData.price);
    dataPayload.append('category', formData.category);
    dataPayload.append('stock', formData.stock);

    // Append kept images
    dataPayload.append('existingImages', JSON.stringify(existingImages));

    // Append newly selected files
    newImageFiles.forEach(file => {
      dataPayload.append('images', file);
    });

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingProduct) {
        // Edit product
        await api.put(`/products/${editingProduct._id}`, dataPayload, config);
        alert('Product updated successfully!');
      } else {
        // Create product
        await api.post('/products', dataPayload, config);
        alert('Product added successfully!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      alert(error.response?.data?.message || 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="products-view">
      <div className="page-header-row">
        <h1 className="page-title">Product Management</h1>
      </div>

      <div className="data-table-card">
        <div className="table-header-bar">
          <h3 className="table-title">All Products</h3>
          <button className="action-btn-primary" onClick={handleAddClick}>
            <span>+ Add Product</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading products...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const displayImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100';
                return (
                  <tr key={product._id}>
                    <td>
                      <div className="table-product-cell">
                        <img src={displayImage} alt={product.name} className="table-product-img" />
                        <span className="table-product-name">{product.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="table-badge category">{product.category}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{product.price.toFixed(2)}</td>
                    <td>{product.stock} units</td>
                    <td>
                      <div className="table-actions">
                        <button className="row-action-btn edit" onClick={() => handleEditClick(product)}>Edit</button>
                        <button className="row-action-btn delete" onClick={() => handleDeleteClick(product._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-card" style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price (INR)</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  className="form-input"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  className="form-input"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              {/* Product Images Section */}
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label">Product Images (Max 6 total)</label>
                
                {/* Image Previews Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '15px' }}>
                  {/* Render Kept/Existing Images */}
                  {existingImages.map((img, idx) => (
                    <div key={`exist-${idx}`} style={{ position: 'relative', width: '100%', paddingTop: '100%', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                      <img src={img.url} alt="product" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveExistingImage(idx)}
                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Render Newly Selected Image Previews */}
                  {newImagePreviews.map((preview, idx) => (
                    <div key={`new-${idx}`} style={{ position: 'relative', width: '100%', paddingTop: '100%', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E5E7EB', backgroundColor: '#F3F4F6' }}>
                      <img src={preview} alt="preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveNewImage(idx)}
                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Add Image Button */}
                  {(existingImages.length + newImageFiles.length) < 6 && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ width: '100%', paddingTop: '100%', position: 'relative', border: '2px dashed #D1D5DB', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#F9FAFB', transition: 'border-color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2D5A27'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                    >
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#6B7280', fontSize: '12px', fontWeight: '600' }}>
                        <span style={{ fontSize: '20px', display: 'block', marginBottom: '2px' }}>+</span>
                        Upload
                      </div>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  multiple
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn-secondary" disabled={submitting} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="action-btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
