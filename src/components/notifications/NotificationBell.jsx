import React, { useState, useRef, useEffect } from 'react';
import bellIcon from '@/assets/icons/bell.svg';
import NotificationList from './NotificationList';

const NotificationBell = ({ notifications = [], onMarkRead, onMarkAllRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="notification-bell" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="notification-bell__button"
        onClick={toggleDropdown}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={bellIcon}
          alt=""
          aria-hidden="true"
          style={{ width: '24px', height: '24px' }}
        />
        {unreadCount > 0 && (
          <span
            className="notification-bell__badge"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              backgroundColor: '#e53e3e',
              color: '#ffffff',
              borderRadius: '50%',
              minWidth: '18px',
              height: '18px',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="notification-bell__dropdown"
          role="dialog"
          aria-label="Notifications"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '360px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          <div
            className="notification-bell__dropdown-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a202c',
              }}
            >
              Notifications
            </h2>
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  if (onMarkAllRead) onMarkAllRead();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#3182ce',
                  padding: 0,
                  fontWeight: '500',
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
          <NotificationList
            notifications={notifications}
            onMarkRead={onMarkRead}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
