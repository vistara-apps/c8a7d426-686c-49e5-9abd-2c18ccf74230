'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { MapPreview } from './MapPreview';
import { formatCurrency, calculateFare } from '@/lib/utils';
import { MOCK_LOCATIONS } from '@/lib/constants';
import { MapPin, Navigation } from 'lucide-react';

export function RideRequestForm() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const estimatedFare = pickup && destination ? calculateFare(5000, 900) : 0;

  const handleRequestRide = async () => {
    if (!pickup || !destination) return;

    setIsRequesting(true);

    try {
      // Create ride request via API
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requesterId: 'demo-user', // In production, get from authenticated user
          pickupLocation: pickup,
          dropoffLocation: destination,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ride request');
      }

      const rideData = await response.json();
      console.log('Ride created:', rideData);

      setIsRequesting(false);
      setShowConfirmation(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        setPickup('');
        setDestination('');
      }, 3000);
    } catch (error) {
      console.error('Error requesting ride:', error);
      setIsRequesting(false);
      // In production, show error message to user
    }
  };

  const handleQuickLocation = (location: string) => {
    if (!pickup) {
      setPickup(location);
    } else if (!destination) {
      setDestination(location);
    }
  };

  if (showConfirmation) {
    return (
      <Card className="text-center animate-slide-up">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
            <Navigation className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Ride Requested!</h3>
            <p className="text-sm text-gray-600 mt-1">
              Looking for nearby drivers...
            </p>
          </div>
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-sm text-gray-700">
              Estimated fare: <span className="font-medium">{formatCurrency(estimatedFare)}</span>
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-gray-900">Request a Ride</h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location
            </label>
            <Input
              placeholder="Enter pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <Input
              placeholder="Where to?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          {/* Quick location buttons */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Quick locations:</p>
            <div className="flex flex-wrap gap-2">
              {MOCK_LOCATIONS.slice(0, 3).map((location) => (
                <button
                  key={location}
                  onClick={() => handleQuickLocation(location)}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  {location.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {pickup && destination && (
          <div className="space-y-3">
            <MapPreview pickup={pickup} destination={destination} />
            
            <div className="bg-gray-50 rounded-md p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated fare:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(estimatedFare)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Includes 15% platform commission
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handleRequestRide}
          disabled={!pickup || !destination}
          loading={isRequesting}
          className="w-full"
        >
          {isRequesting ? 'Requesting Ride...' : 'Request Ride'}
        </Button>
      </div>
    </Card>
  );
}
