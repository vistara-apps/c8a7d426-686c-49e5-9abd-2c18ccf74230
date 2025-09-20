export interface User {
  farcasterId: string;
  walletAddress: string;
  role: 'rider' | 'driver';
  rating: number;
}

export interface Ride {
  rideId: string;
  requesterId: string;
  driverId?: string;
  pickupLocation: string;
  dropoffLocation: string;
  requestTimestamp: number;
  pickupTimestamp?: number;
  completeTimestamp?: number;
  fareAmount: number;
  commissionRate: number;
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
}

export interface DriverProfile {
  userId: string;
  vehicleDetails: string;
  licenseNumber: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  activeStatus: boolean;
}

export interface CommissionProposal {
  proposalId: string;
  proposerId: string;
  newRate: number;
  status: 'pending' | 'approved' | 'rejected';
  creationTimestamp: number;
  voteCount: number;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface RideRequest {
  pickup: string;
  destination: string;
  estimatedFare: number;
}
