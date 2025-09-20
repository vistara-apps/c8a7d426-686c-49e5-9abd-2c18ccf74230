import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/types';

// Mock database - replace with real database in production
let users: User[] = [
  {
    farcasterId: 'demo-user',
    walletAddress: '0x1234567890123456789012345678901234567890',
    role: 'rider',
    rating: 4.8,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farcasterId = searchParams.get('farcasterId');

    if (farcasterId) {
      const user = users.find(u => u.farcasterId === farcasterId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { farcasterId, walletAddress, role = 'rider' } = body;

    if (!farcasterId || !walletAddress) {
      return NextResponse.json(
        { error: 'farcasterId and walletAddress are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(u => u.farcasterId === farcasterId);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const newUser: User = {
      farcasterId,
      walletAddress,
      role,
      rating: 5.0, // New users start with perfect rating
    };

    users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { farcasterId, ...updates } = body;

    if (!farcasterId) {
      return NextResponse.json(
        { error: 'farcasterId is required' },
        { status: 400 }
      );
    }

    const userIndex = users.findIndex(u => u.farcasterId === farcasterId);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user
    users[userIndex] = { ...users[userIndex], ...updates };

    return NextResponse.json(users[userIndex]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

