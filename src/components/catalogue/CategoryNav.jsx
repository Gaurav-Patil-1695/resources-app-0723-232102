import React, { useState } from 'react';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

/**
 * categories: Array<{
 *   id, label, slug, count?,
 *   children?: Array<{ id, label, slug, count?, children? }>
 * }>
 * selectedId: string
 * onSelect: (category) => void
 */

const CategoryNavItem = ({ item, level = 0, selectedId, onSelect }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = item.id === selectedId;
  const isAncestorOfSelected = hasChildren &&
    item.children.some(
      (child) =>
        child.id === selectedId ||
        (child.children || []).some((gc) => gc.id === selectedId)
    );
  const [expanded, setExpanded] = useState(isSelected || isAncestorOfSelected);

  const handleClick = () => {
    if (hasChildren) setExpanded((e) => !e);
    if (onSelect) onSelect(item);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <li
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={hasChildren ? expanded : undefined}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          paddingLeft: `${level * 16 + 8}px`,
          paddingRight: '8px',
          paddingTop: '6px',
          paddingBottom: '6px',
          cursor: 'pointer',
          backgroundColor: isSelected ? '#eff6ff' : 'transparent',
          borderRadius: '4px',
          userSelect: 'none',
        }}
        tabIndex={0}
        role="button"
        aria-label={item.label}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {hasChildren && (
          <img
            src={expanded ? chevronDownIcon : chevronRightIcon}
            alt=""
            aria-hidden="true"
            style={{ width: '14px', height: '14px', flexShrink: 0 }}
          />
        )}
        {!hasChildren && <span style={{ width: '14px', flexShrink: 0 }} />}
        <span
          style={{
            flexGrow: 1,
            fontSize: level === 0 ? '14px' : '13px',
            fontWeight: isSelected ? 600 : level === 0 ? 500 : 400,
            color: isSelected ? '#1d4ed8' : '#374151',
          }}
        >
          {item.label}
        </span>
        {item.count != null && (
          <span
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              backgroundColor: '#f3f4f6',
              borderRadius: '10px',
              padding: '1px 7px',
              flexShrink: 0,
            }}
          >
            {item.count}
          </span>
        )}
      </div>
      {hasChildren && expanded && (
        <ul role="group" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {item.children.map((child) => (
            <CategoryNavItem
              key={child.id}
              item={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const CategoryNav = ({ categories = [], selectedId, onSelect }) => {
  return (
    <nav
      className="category-nav"
      aria-label="Category navigation"
    >
      <ul
        role="tree"
        aria-label="Categories"
        style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}
      >
        {categories.map((cat) => (
          <CategoryNavItem
            key={cat.id}
            item={cat}
            level={0}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNav;
