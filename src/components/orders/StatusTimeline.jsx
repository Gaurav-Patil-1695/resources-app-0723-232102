import React from 'react';

const STAGES = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

const STAGE_ORDER = {
  confirmed: 0,
  packed: 1,
  shipped: 2,
  delivered: 3,
};

function StageIcon({ completed, active }) {
  if (completed) {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }

  if (active) {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500">
        <span className="w-3 h-3 rounded-full bg-white" />
      </span>
    );
  }

  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 bg-white">
      <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
    </span>
  );
}

function StatusTimeline({ status, timestamps }) {
  const currentIndex = STAGE_ORDER[status] ?? -1;

  return (
    <div className="w-full" aria-label="Order status timeline">
      <ol className="flex items-start justify-between relative">
        {STAGES.map((stage, index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;
          const isLast = index === STAGES.length - 1;
          const timestamp = timestamps && timestamps[stage.key];

          return (
            <li key={stage.key} className="flex flex-col items-center flex-1 relative">
              {/* Connector line */}
              {!isLast && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 ${
                    completed ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                  style={{ left: '50%', width: '100%' }}
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10">
                <StageIcon completed={completed} active={active} />
              </div>

              <div className="mt-2 text-center px-1">
                <p
                  className={`text-xs font-medium ${
                    active
                      ? 'text-blue-600'
                      : completed
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  {stage.label}
                </p>
                {timestamp && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default StatusTimeline;
