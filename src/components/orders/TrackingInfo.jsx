import React from 'react';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import packageIcon from '@/assets/icons/package.svg';
import externalLinkIcon from '@/assets/icons/external-link.svg';

const CARRIER_LABELS = {
  ups: 'UPS',
  fedex: 'FedEx',
  usps: 'USPS',
  dhl: 'DHL',
  ontrac: 'OnTrac',
};

function TrackingEvent({ event }) {
  const { timestamp, location, description } = event;

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
        <span className="w-px flex-1 bg-gray-200 mt-1" />
      </div>
      <div className="pb-4">
        <p className="text-sm text-gray-800">{description}</p>
        {location && (
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <img src={mapPinIcon} alt="" className="w-3 h-3" aria-hidden="true" />
            {location}
          </p>
        )}
        {formattedTime && (
          <p className="text-xs text-gray-400 mt-0.5">{formattedTime}</p>
        )}
      </div>
    </li>
  );
}

function TrackingInfo({ tracking }) {
  if (!tracking) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-500">
        Tracking information is not yet available.
      </div>
    );
  }

  const {
    tracking_number,
    carrier,
    estimated_delivery,
    tracking_url,
    events,
  } = tracking;

  const carrierLabel = CARRIER_LABELS[carrier?.toLowerCase()] || carrier || 'Carrier';

  const formattedETA = estimated_delivery
    ? new Date(estimated_delivery).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <img src={packageIcon} alt="" className="w-5 h-5 text-gray-600" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {carrierLabel}
          </p>
          {tracking_number && (
            <p className="text-xs text-gray-500 font-mono">{tracking_number}</p>
          )}
        </div>
        {tracking_url && (
          <a
            href={tracking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Track shipment on carrier website"
          >
            Track
            <img src={externalLinkIcon} alt="" className="w-3 h-3" aria-hidden="true" />
          </a>
        )}
      </div>

      {/* ETA */}
      {formattedETA && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Estimated Delivery</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">{formattedETA}</p>
        </div>
      )}

      {/* Events */}
      {events && events.length > 0 ? (
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
            Tracking History
          </p>
          <ul className="space-y-0">
            {events.map((event, index) => (
              <TrackingEvent key={index} event={event} />
            ))}
          </ul>
        </div>
      ) : (
        <div className="px-4 py-4 text-sm text-gray-500">
          No tracking events available yet.
        </div>
      )}
    </div>
  );
}

export default TrackingInfo;
