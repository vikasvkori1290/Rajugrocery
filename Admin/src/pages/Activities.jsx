import React from 'react';

const Activities = () => {
  const logs = [
    { id: 1, user: 'Raj Admin', action: 'Added product "Cold-Pressed Mustard Oil"', time: '10 mins ago' },
    { id: 2, user: 'Raj Admin', action: 'Updated price for "Premium Basmati Rice"', time: '34 mins ago' },
    { id: 3, user: 'System', action: 'Cleared database cache logs', time: '1 hour ago' },
    { id: 4, user: 'Raj Admin', action: 'Logged in to Admin Console', time: '2 hours ago' },
    { id: 5, user: 'System', action: 'Auto-backed up product catalog database', time: 'Yesterday' }
  ];

  return (
    <div className="activities-view">
      <div className="page-header-row">
        <h1 className="page-title">Recent Activities Audit</h1>
      </div>

      <div className="audit-list">
        {logs.map((log) => (
          <div key={log.id} className="audit-item">
            <div className="audit-header">
              <span className="audit-user">👤 {log.user}</span>
              <span className="audit-time">{log.time}</span>
            </div>
            <p className="audit-action">{log.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
