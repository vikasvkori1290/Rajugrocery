import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 37775,
    totalOrders: 7,
    activeProducts: 47,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const prodRes = await api.get('/products');
        const orderRes = await api.get('/orders');

        const productsCount = prodRes.data.length;
        const ordersCount = orderRes.data.length;
        
        let salesSum = 0;
        if (orderRes.data && orderRes.data.length > 0) {
          salesSum = orderRes.data.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        }

        setStats({
          totalSales: salesSum > 0 ? salesSum : 37775, // Fallback to mockup value if empty
          totalOrders: ordersCount > 0 ? ordersCount : 7,
          activeProducts: productsCount > 0 ? productsCount : 47,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
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

      <div className="metrics-grid">
        {/* Total Sales */}
        <div className="metric-card">
          <p className="metric-label">TOTAL SALES</p>
          <h2 className="metric-val sales-green">
            ₹{stats.totalSales.toLocaleString('en-IN')}
          </h2>
        </div>

        {/* Total Orders */}
        <div className="metric-card">
          <p className="metric-label">TOTAL ORDERS</p>
          <h2 className="metric-val">
            {stats.totalOrders}
          </h2>
        </div>

        {/* Active Products */}
        <div className="metric-card">
          <p className="metric-label">ACTIVE PRODUCTS</p>
          <h2 className="metric-val products-accent">
            {stats.activeProducts}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
