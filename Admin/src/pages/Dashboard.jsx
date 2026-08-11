import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [activeProducts, setActiveProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const prodRes = await api.get('/products');
        setActiveProducts(prodRes.data.length);
      } catch (error) {
        console.error('Error fetching products count', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-view">
      <div className="page-header-row">
        <h1 className="page-title">Admin Dashboard Overview</h1>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: '1fr' }}>
        {/* Active Products */}
        <div className="metric-card" style={{ maxWidth: '350px' }}>
          <p className="metric-label">ACTIVE PRODUCTS</p>
          <h2 className="metric-val products-accent">
            {loading ? '...' : activeProducts}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
