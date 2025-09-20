import { NextRequest, NextResponse } from 'next/server';
import { LocationCoordinates } from '@/lib/types';

// Mock geocoding service - replace with real service in production
const mockGeocode = async (address: string): Promise<LocationCoordinates> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock coordinates based on address
  const mockCoords: Record<string, LocationCoordinates> = {
    'Times Square, New York': { lat: 40.7580, lng: -73.9855 },
    'Central Park, New York': { lat: 40.7829, lng: -73.9654 },
    'Brooklyn Bridge, New York': { lat: 40.7061, lng: -73.9969 },
    'Wall Street, New York': { lat: 40.7060, lng: -74.0088 },
    'Empire State Building, New York': { lat: 40.7484, lng: -73.9857 },
  };

  return mockCoords[address] || { lat: 40.7128, lng: -74.0060 }; // Default to NYC center
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (coord1: LocationCoordinates, coord2: LocationCoordinates): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Estimate travel time (simple approximation)
const estimateTravelTime = (distance: number): number => {
  // Assume average speed of 30 km/h in city
  const speedKmh = 30;
  return Math.round((distance / speedKmh) * 60); // minutes
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'geocode': {
        const address = searchParams.get('address');
        if (!address) {
          return NextResponse.json(
            { error: 'Address parameter is required for geocoding' },
            { status: 400 }
          );
        }

        const coordinates = await mockGeocode(address);
        return NextResponse.json({ address, coordinates });
      }

      case 'route': {
        const pickup = searchParams.get('pickup');
        const destination = searchParams.get('destination');

        if (!pickup || !destination) {
          return NextResponse.json(
            { error: 'Pickup and destination parameters are required for routing' },
            { status: 400 }
          );
        }

        const pickupCoords = await mockGeocode(pickup);
        const destCoords = await mockGeocode(destination);
        const distance = calculateDistance(pickupCoords, destCoords);
        const duration = estimateTravelTime(distance);

        return NextResponse.json({
          pickup: { address: pickup, coordinates: pickupCoords },
          destination: { address: destination, coordinates: destCoords },
          route: {
            distance,
            duration,
            waypoints: [pickupCoords, destCoords],
          },
        });
      }

      case 'nearby': {
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const radius = searchParams.get('radius') || '5'; // km

        if (!lat || !lng) {
          return NextResponse.json(
            { error: 'Latitude and longitude parameters are required' },
            { status: 400 }
          );
        }

        const centerCoords: LocationCoordinates = {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        };

        // Mock nearby drivers
        const mockDrivers = [
          { id: 'driver1', lat: 40.7580, lng: -73.9855, distance: 0.5 },
          { id: 'driver2', lat: 40.7829, lng: -73.9654, distance: 2.1 },
          { id: 'driver3', lat: 40.7061, lng: -73.9969, distance: 3.2 },
        ].filter(driver => driver.distance <= parseFloat(radius));

        return NextResponse.json({
          center: centerCoords,
          radius: parseFloat(radius),
          drivers: mockDrivers,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "geocode", "route", or "nearby"' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in maps API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'geocode': {
        const { address } = params;
        if (!address) {
          return NextResponse.json(
            { error: 'Address is required for geocoding' },
            { status: 400 }
          );
        }

        const coordinates = await mockGeocode(address);
        return NextResponse.json({ address, coordinates });
      }

      case 'batch-geocode': {
        const { addresses } = params;
        if (!Array.isArray(addresses)) {
          return NextResponse.json(
            { error: 'Addresses array is required for batch geocoding' },
            { status: 400 }
          );
        }

        const results = await Promise.all(
          addresses.map(async (address: string) => ({
            address,
            coordinates: await mockGeocode(address),
          }))
        );

        return NextResponse.json({ results });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action for POST request' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in maps API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

