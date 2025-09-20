import { NextRequest, NextResponse } from 'next/server';
import { Ride, RideRequest } from '@/lib/types';
import { generateRideId, calculateFare } from '@/lib/utils';

// Mock database - replace with real database in production
let rides: Ride[] = [
  {
    rideId: 'ride_001',
    requesterId: 'demo-user',
    driverId: 'demo-driver',
    pickupLocation: 'Times Square, New York',
    dropoffLocation: 'Central Park, New York',
    requestTimestamp: Date.now() - 3600000, // 1 hour ago
    pickupTimestamp: Date.now() - 3300000, // 55 minutes ago
    completeTimestamp: Date.now() - 3000000, // 50 minutes ago
    fareAmount: 15.50,
    commissionRate: 0.15,
    status: 'completed',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const requesterId = searchParams.get('requesterId');
    const driverId = searchParams.get('driverId');

    let filteredRides = rides;

    if (status) {
      filteredRides = filteredRides.filter(ride => ride.status === status);
    }

    if (requesterId) {
      filteredRides = filteredRides.filter(ride => ride.requesterId === requesterId);
    }

    if (driverId) {
      filteredRides = filteredRides.filter(ride => ride.driverId === driverId);
    }

    return NextResponse.json(filteredRides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requesterId, pickupLocation, dropoffLocation } = body;

    if (!requesterId || !pickupLocation || !dropoffLocation) {
      return NextResponse.json(
        { error: 'requesterId, pickupLocation, and dropoffLocation are required' },
        { status: 400 }
      );
    }

    // Calculate estimated fare (mock calculation)
    const estimatedFare = calculateFare(5000, 900); // 5km, 15 minutes

    const newRide: Ride = {
      rideId: generateRideId(),
      requesterId,
      pickupLocation,
      dropoffLocation,
      requestTimestamp: Date.now(),
      fareAmount: estimatedFare,
      commissionRate: 0.15,
      status: 'requested',
    };

    rides.push(newRide);

    return NextResponse.json(newRide, { status: 201 });
  } catch (error) {
    console.error('Error creating ride:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { rideId, ...updates } = body;

    if (!rideId) {
      return NextResponse.json(
        { error: 'rideId is required' },
        { status: 400 }
      );
    }

    const rideIndex = rides.findIndex(ride => ride.rideId === rideId);
    if (rideIndex === -1) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    // Update ride
    rides[rideIndex] = { ...rides[rideIndex], ...updates };

    return NextResponse.json(rides[rideIndex]);
  } catch (error) {
    console.error('Error updating ride:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Accept ride (PATCH for partial updates)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { rideId, driverId, action } = body;

    if (!rideId || !action) {
      return NextResponse.json(
        { error: 'rideId and action are required' },
        { status: 400 }
      );
    }

    const rideIndex = rides.findIndex(ride => ride.rideId === rideId);
    if (rideIndex === -1) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    const ride = rides[rideIndex];

    switch (action) {
      case 'accept':
        if (!driverId) {
          return NextResponse.json(
            { error: 'driverId is required for accept action' },
            { status: 400 }
          );
        }
        rides[rideIndex] = {
          ...ride,
          driverId,
          status: 'accepted',
        };
        break;

      case 'start':
        if (ride.status !== 'accepted') {
          return NextResponse.json(
            { error: 'Ride must be accepted before starting' },
            { status: 400 }
          );
        }
        rides[rideIndex] = {
          ...ride,
          pickupTimestamp: Date.now(),
          status: 'in_progress',
        };
        break;

      case 'complete':
        if (ride.status !== 'in_progress') {
          return NextResponse.json(
            { error: 'Ride must be in progress before completing' },
            { status: 400 }
          );
        }
        rides[rideIndex] = {
          ...ride,
          completeTimestamp: Date.now(),
          status: 'completed',
        };
        break;

      case 'cancel':
        rides[rideIndex] = {
          ...ride,
          status: 'cancelled',
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(rides[rideIndex]);
  } catch (error) {
    console.error('Error updating ride:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

