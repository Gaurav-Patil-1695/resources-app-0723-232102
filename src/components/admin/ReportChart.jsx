import React, { useMemo } from 'react';

/**
 * ReportChart - Wrapper around a simple SVG bar chart for consolidated reports.
 *
 * We render a lightweight built-in SVG bar chart to avoid mandating a specific
 * third-party charting library. If a `renderChart` prop is provided, it is
 * called with (data, config) and its output is rendered instead (escape hatch
 * for integrating recharts / chart.js / etc.).
 *
 * Props:
 *   title       {string}    - chart title
 *   data        {array}     - [{ label, value }]
 *   type        {string}    - 'bar' | 'line' (default 'bar')
 *   color       {string}    - bar/line fill color (default '#3b82f6')
 *   height      {number}    - SVG height in px (default 240)
 *   renderChart {function}  - optional (data, config) => ReactNode override
 *   loading     {boolean}
 *   emptyText   {string}
 */

const PADDING = { top: 20, right: 16, bottom: 40, left: 48 };

const ReportChart = ({
  title,
  data = [],
  type = 'bar',
  color = '#3b82f6',
  height = 240,
  renderChart,
  loading = false,
  emptyText = 'No data available.',
}) => {
  const innerW = 600;
  const innerH = height - PADDING.top - PADDING.bottom;

  const maxValue = useMemo(() => {
    if (!data.length) return 1;
    return Math.max(...data.map((d) => d.value || 0)) || 1;
  }, [data]);

  const barWidth = data.length ? Math.max(4, (innerW - 16) / data.length - 6) : 20;

  const xPos = (i) =>
    PADDING.left + i * ((innerW - PADDING.left - PADDING.right) / Math.max(data.length, 1)) +
    (innerW - PADDING.left - PADDING.right) / Math.max(data.length, 1) / 2;

  const yPos = (v) => PADDING.top + innerH - (v / maxValue) * innerH;

  const yTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(Math.round((maxValue * i) / 4));
    }
    return ticks;
  }, [maxValue]);

  const linePath = useMemo(() => {
    if (!data.length) return '';
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i)} ${yPos(d.value || 0)}`)
      .join(' ');
  }, [data, maxValue]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center" style={{ height }}>
          <span className="text-gray-400 text-sm">Loading chart…</span>
        </div>
      );
    }

    if (!data.length) {
      return (
        <div className="flex items-center justify-center" style={{ height }}>
          <span className="text-gray-400 text-sm">{emptyText}</span>
        </div>
      );
    }

    if (renderChart) {
      return renderChart(data, { type, color, height });
    }

    return (
      <svg
        viewBox={`0 0 ${innerW} ${height}`}
        width="100%"
        height={height}
        aria-label={title || 'Report chart'}
        role="img"
      >
        {/* Y grid lines & labels */}
        {yTicks.map((tick) => {
          const y = yPos(tick);
          return (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={innerW - PADDING.right}
                y1={y}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 6}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="#9ca3af"
              >
                {tick.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {type === 'bar' &&
          data.map((d, i) => {
            const x = xPos(i) - barWidth / 2;
            const barH = ((d.value || 0) / maxValue) * innerH;
            const y = PADDING.top + innerH - barH;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  fill={color}
                  rx={3}
                  opacity={0.85}
                >
                  <title>{`${d.label}: ${d.value}`}</title>
                </rect>
                <text
                  x={xPos(i)}
                  y={PADDING.top + innerH + 18}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#6b7280"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

        {/* Line */}
        {type === 'line' && (
          <>
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {data.map((d, i) => (
              <g key={i}>
                <circle cx={xPos(i)} cy={yPos(d.value || 0)} r={3} fill={color}>
                  <title>{`${d.label}: ${d.value}`}</title>
                </circle>
                <text
                  x={xPos(i)}
                  y={PADDING.top + innerH + 18}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#6b7280"
                >
                  {d.label}
                </text>
              </g>
            ))}
          </>
        )}

        {/* X-axis baseline */}
        <line
          x1={PADDING.left}
          x2={innerW - PADDING.right}
          y1={PADDING.top + innerH}
          y2={PADDING.top + innerH}
          stroke="#d1d5db"
          strokeWidth={1}
        />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-3">
      {title && (
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      )}
      <div className="overflow-hidden">{renderContent()}</div>
    </div>
  );
};

export default ReportChart;
