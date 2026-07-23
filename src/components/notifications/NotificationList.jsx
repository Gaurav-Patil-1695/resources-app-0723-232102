import React from 'react';
import emptyStateImage from '@/assets/images/empty-state.svg';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications = [], onMarkRead }) => {
  if (notifications.length === 0) {
    return (
      <div
        className="notification-list notification-list--empty"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          gap: '12px',
        }}
      >
        <img
          src={emptyStateImage}
          alt=""
          aria-hidden="true"
          style={{ width: '80px', height: '80px', opacity: 0.6 }}
        />
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            color: '#718096',
            textAlign: 'center',
          }}
        >
          You have no notifications yet.
        </p>
      </div>
    );
  }

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);
  const sorted = [...unread, ...read];

  return (
    <ul
      className="notification-list"
      role="list"
      aria-label="Notification items"
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        maxHeight: '400px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {sorted.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
        />
      ))}
    </ul>
  );
};

export default NotificationList;
