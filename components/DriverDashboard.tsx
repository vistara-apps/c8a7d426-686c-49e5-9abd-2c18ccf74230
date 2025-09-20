'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { StatusIndicator } from './StatusIndicator';
import { formatCurrency, formatDistance } from '@/lib/utils';
import { Car, Clock, DollarSign, Users } from 'lucide-react';

interface MockRide {
  id: string;
  pickup: string;
  destination: string;
  fare: number;
  distance: number;
  requestTime: string;
}

const mockRides: MockRide[] = [
  {
    id: '1',
    pickup: 'Times Square',
    destination: 'Central Park',
    fare: 12.50,
    distance: 2500,
    requestTime: '2 min ago'
  },
  {
    id: '2',
    pickup: 'Brooklyn Bridge',
    destination: 'Wall Street',
    fare: 8.75,
    distance: 1800,
    requestTime: '5 min ago'
  }
];

export function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [acceptingRide, setAcceptingRide] = useState<string | null>(null);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
  };

  const handleAcceptRide = async (rideId: string) => {
    setAcceptingRide(rideId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAcceptingRide(null);
    // In a real app, this would update the ride status and navigate to ride details
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-gray-900">Driver Dashboard</h2>
          </div>
          <StatusIndicator status={isOnline ? 'active' : 'inactive'}>
            {isOnline ? 'Online' : 'Offline'}
          </StatusIndicator>
        </div>

        {/* Driver Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500">Today</p>
            <p className="font-semibold text-sm">$127.50</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-1">
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-500">Rides</p>
            <p className="font-semibold text-sm">8</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-1">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500">Hours</p>
            <p className="font-semibold text-sm">6.5</p>
          </div>
        </div>

        {/* Online/Offline Toggle */}
        <Button
          onClick={handleToggleOnline}
          variant={isOnline ? 'destructive' : 'primary'}
          className="w-full"
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </Button>

        {/* Available Rides */}
        {isOnline && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Available Rides</h3>
            
            {mockRides.length > 0 ? (
              <div className="space-y-2">
                {mockRides.map((ride) => (
                  <div key={ride.id} className="border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {ride.pickup} → {ride.destination}
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatDistance(ride.distance)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {ride.requestTime}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-gray-900">
                          {formatCurrency(ride.fare)}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => handleAcceptRide(ride.id)}
                      loading={acceptingRide === ride.id}
                      className="w-full"
                    >
                      {acceptingRide === ride.id ? 'Accepting...' : 'Accept Ride'}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Car className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No rides available</p>
                <p className="text-xs text-gray-400">Check back in a moment</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
