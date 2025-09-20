export const COMMISSION_RATES = {
  DEFAULT: 0.15,
  MIN: 0.05,
  MAX: 0.25,
} as const;

export const RIDE_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const USER_ROLES = {
  RIDER: 'rider',
  DRIVER: 'driver',
} as const;

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export const PROPOSAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const MOCK_LOCATIONS = [
  'Times Square, New York',
  'Central Park, New York',
  'Brooklyn Bridge, New York',
  'Wall Street, New York',
  'Empire State Building, New York',
] as const;
