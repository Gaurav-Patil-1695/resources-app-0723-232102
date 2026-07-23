import React from 'react';
import checkIcon from '@/assets/icons/check.svg';
import packageIcon from '@/assets/icons/package.svg';
import heartIcon from '@/assets/icons/heart.svg';
import starIcon from '@/assets/icons/star.svg';
import cartIcon from '@/assets/icons/cart.svg';
import bellIcon from '@/assets/icons/bell.svg';
import userIcon from '@/assets/icons/user.svg';

const TYPE_ICON_MAP = {
  order: packageIcon,
  wishlist: heartIcon,
  review: starIcon,
  cart: cartIcon,
  account: userIcon,
  default: bellIcon,
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const NotificationItem = ({ notification, onMarkRead }) => {
  const { id, type, message, timestamp, read } = notification;

  const iconSrc = TYPE_ICON_MAP[type] || TYPE_ICON_MAP.default;
  const formattedTime = formatTimestamp(timestamp);

  const handleMarkRead = () => {
    if (!read && onMarkRead) {
      onMarkRead(id);
    }
  };

  return (
    <li
      className={`notification-item${read ? ' notification-item--read' : ' notification-item--unread'}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: read ? '#ffffff' : '#ebf8ff',
        transition: 'background-color 0.2s ease',
        position: 'relative',
      }}
    >
      <div
        className="notification-item__icon-wrapper"
        style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: read ? '#edf2f7' : '#bee3f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={iconSrc}
          alt=""
          aria-hidden="true"
          style={{ width: '18px', height: '18px' }}
        />
      </div>

      <div
        className="notification-item__content"
        style={{ flex: 1, minWidth: 0 }}
      >
        <p
          className="notification-item__message"
          style={{
            margin: '0 0 4px 0',
            fontSize: '14px',
            color: '#2d3748',
            fontWeight: read ? '400' : '500',
            lineHeight: '1.4',
            wordBreak: 'break-word',
          }}
        >
          {message}
        </p>
        <time
          className="notification-item__timestamp"
          dateTime={timestamp}
          style={{
            fontSize: '12px',
            color: '#718096',
          }}
        >
          {formattedTime}
        </time>
      </div>

      {!read && (
        <button
          className="notification-item__mark-read"
          onClick={handleMarkRead}
          aria-label="Mark notification as read"
          title="Mark as read"
          style={{
            flexShrink: 0,
            background: 'none',
            border: '1px solid #90cdf4',
            borderRadius: '50%',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            color: '#3182ce',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ebf8ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <img
            src={checkIcon}
            alt=""\n            aria-hidden="true"
            style={{ width: '14px', height: '14px' }}
          />
        </button>
      )}
    </li>
  );
};

export default NotificationItem;
