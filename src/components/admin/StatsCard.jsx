import React from 'react';

/**
 * StatsCard - Dashboard KPI tile
 * Props:
 *   label      {string}  - metric label
 *   value      {string|number} - metric value
 *   trend      {number}  - percentage change (positive = up, negative = down)
 *   trendLabel {string}  - optional descriptive label for the trend
 *   icon       {node}    - optional icon element
 */
const StatsCard = ({ label, value, trend, trendLabel, icon }) => {
  const isPositive = trend > 0;
  const isNeutral = trend === 0 || trend == null;

  const trendColor = isNeutral
    ? 'text-gray-500'
    : isPositive
    ? 'text-green-600'
    : 'text-red-600';

  const trendArrow = isNeutral ? null : isPositive ? '▲' : '▼';

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 min-w-[160px]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        {icon && (
          <span className="text-gray-400">{icon}</span>
        )}
      </div>

      <div className="text-3xl font-bold text-gray-900">{value}</div>

      {trend != null && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          {trendArrow && <span aria-hidden="true">{trendArrow}</span>}
          <span>
            {Math.abs(trend)}%{trendLabel ? ` ${trendLabel}` : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
