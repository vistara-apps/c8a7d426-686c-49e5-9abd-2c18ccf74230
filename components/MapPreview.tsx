'use client';

import { useState } from 'react';
import { Card } from './Card';
import { MapPin } from 'lucide-react';

interface MapPreviewProps {
  pickup?: string;
  destination?: string;
  variant?: 'static';
  className?: string;
}

export function MapPreview({ pickup, destination, variant = 'static', className }: MapPreviewProps) {
  const [imageError, setImageError] = useState(false);

  // Mock static map URL - in production, use actual mapping service
  const mapUrl = pickup && destination 
    ? `https://via.placeholder.com/400x200/e5e7eb/6b7280?text=Route+Map`
    : `https://via.placeholder.com/400x200/e5e7eb/6b7280?text=Map+Preview`;

  return (
    <Card className={className}>
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Route Preview</h3>
        
        <div className="relative bg-gray-100 rounded-md overflow-hidden">
          {!imageError ? (
            <img
              src={mapUrl}
              alt="Route map"
              className="w-full h-32 object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center bg-gray-100">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {pickup && destination && (
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="text-gray-900">{pickup}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="text-gray-900">{destination}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
