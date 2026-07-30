import React from 'react';

const Requests = () => {
  const tickets = [
    { id: 1, user: 'John Doe', subject: 'Detergent leak in delivery packet', status: 'High', time: '1 hour ago' },
    { id: 2, user: 'Mary Jane', subject: 'Change of delivery address request', status: 'Medium', time: '3 hours ago' },
    { id: 3, user: 'David Miller', subject: 'Inquiry about bulk biscuits order discount', status: 'Low', time: '5 hours ago' }
  ];

  return (
    <div className="requests-view">
      <div className="page-header-row">
        <h1 className="page-title">Customer Support Tickets & Requests</h1>
      </div>

      <div className="tickets-list">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="ticket-item">
            <div className="ticket-header">
              <span className="ticket-user">📧 {ticket.user}</span>
              <span className="ticket-time">{ticket.time}</span>
            </div>
            <p style={{ margin: '8px 0', fontSize: '15px', color: '#111827', fontWeight: 600 }}>{ticket.subject}</p>
            <span className="table-badge" style={{
              backgroundColor: ticket.status === 'High' ? '#FEE2E2' : ticket.status === 'Medium' ? '#FEF3C7' : '#F3F4F6',
              color: ticket.status === 'High' ? '#991B1B' : ticket.status === 'Medium' ? '#92400E' : '#374151'
            }}>
              Priority: {ticket.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
