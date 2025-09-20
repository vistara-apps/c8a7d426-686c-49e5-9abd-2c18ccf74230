import { NextRequest, NextResponse } from 'next/server';
import { DriverProfile } from '@/lib/types';

// Mock database - replace with real database in production
let driverProfiles: DriverProfile[] = [
  {
    userId: 'demo-driver',
    vehicleDetails: '2020 Toyota Camry, Blue',
    licenseNumber: 'DL123456789',
    verificationStatus: 'verified',
    activeStatus: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let filteredProfiles = driverProfiles;

    if (userId) {
      filteredProfiles = filteredProfiles.filter(profile => profile.userId === userId);
    }

    if (status) {
      filteredProfiles = filteredProfiles.filter(profile => profile.verificationStatus === status);
    }

    return NextResponse.json(filteredProfiles);
  } catch (error) {
    console.error('Error fetching driver profiles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, vehicleDetails, licenseNumber } = body;

    if (!userId || !vehicleDetails || !licenseNumber) {
      return NextResponse.json(
        { error: 'userId, vehicleDetails, and licenseNumber are required' },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = driverProfiles.find(p => p.userId === userId);
    if (existingProfile) {
      return NextResponse.json(
        { error: 'Driver profile already exists' },
        { status: 409 }
      );
    }

    const newProfile: DriverProfile = {
      userId,
      vehicleDetails,
      licenseNumber,
      verificationStatus: 'pending',
      activeStatus: false,
    };

    driverProfiles.push(newProfile);

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error('Error creating driver profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const profileIndex = driverProfiles.findIndex(p => p.userId === userId);
    if (profileIndex === -1) {
      return NextResponse.json({ error: 'Driver profile not found' }, { status: 404 });
    }

    // Update profile
    driverProfiles[profileIndex] = { ...driverProfiles[profileIndex], ...updates };

    return NextResponse.json(driverProfiles[profileIndex]);
  } catch (error) {
    console.error('Error updating driver profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Verify driver profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId and action are required' },
        { status: 400 }
      );
    }

    const profileIndex = driverProfiles.findIndex(p => p.userId === userId);
    if (profileIndex === -1) {
      return NextResponse.json({ error: 'Driver profile not found' }, { status: 404 });
    }

    const profile = driverProfiles[profileIndex];

    switch (action) {
      case 'verify':
        driverProfiles[profileIndex] = {
          ...profile,
          verificationStatus: 'verified',
          activeStatus: true,
        };
        break;

      case 'reject':
        driverProfiles[profileIndex] = {
          ...profile,
          verificationStatus: 'rejected',
          activeStatus: false,
        };
        break;

      case 'activate':
        if (profile.verificationStatus !== 'verified') {
          return NextResponse.json(
            { error: 'Driver must be verified before activation' },
            { status: 400 }
          );
        }
        driverProfiles[profileIndex] = {
          ...profile,
          activeStatus: true,
        };
        break;

      case 'deactivate':
        driverProfiles[profileIndex] = {
          ...profile,
          activeStatus: false,
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(driverProfiles[profileIndex]);
  } catch (error) {
    console.error('Error updating driver profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

