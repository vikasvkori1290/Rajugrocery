import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Atta & Flours',
    stock: '',
  });

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

  const handleAddClick = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Atta & Flours',
      stock: '',
    });
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
    try {
      if (editingProduct) {
        // Edit product
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        // Create product
        await api.post('/products', formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      alert(error.response?.data?.message || 'Error saving product');
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
          <div className="modal-content-card">
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
                  rows="4"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="action-btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
