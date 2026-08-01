import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/auth');
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching registered users:', err);
        setError(err.response?.data?.message || 'Failed to load registered users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete customer "${name}"?`)) {
      try {
        await api.delete(`/auth/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert(err.response?.data?.message || 'Failed to delete customer');
      }
    }
  };

  // Filter users by name or email (case insensitive search)
  const filteredUsers = users.filter((user) => {
    const nameMatch = user.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  return (
    <div className="users-view" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="page-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>Registered Customers</h1>
          <p style={{ color: '#4B5563', fontSize: '14px', marginTop: '4px' }}>View, monitor, and search registered customers on the platform.</p>
        </div>
      </div>

      {/* Search Bar & Metrics Row */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        border: '1px solid #E5E7EB',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#9CA3AF' }}>🔍</span>
          <input 
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              borderRadius: '8px',
              border: '1.5px solid #E5E7EB',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: '#F9FAFB'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2D5A27'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>

        {/* User Count Indicator */}
        <div style={{
          backgroundColor: '#eff4ee',
          color: '#2D5A27',
          padding: '10px 20px',
          borderRadius: '30px',
          fontWeight: 700,
          fontSize: '14px'
        }}>
          Showing {filteredUsers.length} of {users.length} Registered Users
        </div>
      </div>

      {/* Main Table Card */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280', fontSize: '16px', fontWeight: 600 }}>Loading customer database...</div>
      ) : error ? (
        <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '16px', borderRadius: '8px', fontWeight: 600, fontSize: '14px' }}>{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '60px 20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          border: '1px solid #E5E7EB'
        }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>👥</span>
          <h3 style={{ color: '#111827', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No Users Found</h3>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Try adjusting your search criteria or register a new customer profile.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1.5px solid #E5E7EB' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '13px', color: '#4B5563' }}>USER</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '13px', color: '#4B5563' }}>CONTACT INFO</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '13px', color: '#4B5563' }}>DEFAULT ADDRESS</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '13px', color: '#4B5563' }}>SYSTEM ROLE</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '13px', color: '#4B5563' }}>REGISTERED ON</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '13px', color: '#4B5563' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    {/* User Info with Cartoon Avatar */}
                    <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={user.avatar || '/avatars/nobita.png'} 
                        alt={user.name} 
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #E5E7EB',
                          backgroundColor: '#F3F4F6'
                        }} 
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>{user.name}</div>
                        <div style={{ color: '#9CA3AF', fontSize: '12px' }}>ID: {user._id?.slice(-8).toUpperCase()}</div>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>{user.email}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{user.phone || 'No Phone Number'}</div>
                    </td>

                    {/* Address details */}
                    <td style={{ padding: '16px 20px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ fontSize: '13px', color: user.address ? '#374151' : '#9CA3AF', fontStyle: user.address ? 'normal' : 'italic' }}>
                        {user.address || 'No address added'}
                      </span>
                    </td>

                    {/* Role badge */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        backgroundColor: user.role === 'admin' ? '#FEF3C7' : '#E0F2FE',
                        color: user.role === 'admin' ? '#92400E' : '#0369A1',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {user.role}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#4B5563' }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>

                    {/* Action buttons (hide/protect admin user deletions) */}
                    <td style={{ padding: '16px 20px' }}>
                      {user.role !== 'admin' ? (
                        <button 
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#EF4444',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#FCA5A5'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#FEE2E2'}
                        >
                          Delete
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
