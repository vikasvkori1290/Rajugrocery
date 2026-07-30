import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Error updating order status');
    }
  };

  return (
    <div className="orders-view">
      <div className="page-header-row">
        <h1 className="page-title">Orders Management</h1>
      </div>

      <div className="data-table-card">
        <div className="table-header-bar">
          <h3 className="table-title">All Customer Orders</h3>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>No orders placed yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{order._id.substring(0, 10)}...</td>
                  <td>{order.user?.name || 'Guest User'}</td>
                  <td style={{ fontWeight: 700 }}>₹{order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`table-badge`} style={{
                      backgroundColor: order.status === 'Delivered' ? '#D1FAE5' : order.status === 'Processing' ? '#FEF3C7' : '#F3F4F6',
                      color: order.status === 'Delivered' ? '#065F46' : order.status === 'Processing' ? '#92400E' : '#374151'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
