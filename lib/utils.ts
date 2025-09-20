import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

export function calculateFare(distance: number, duration: number, commissionRate: number = 0.15): number {
  const baseFare = 2.50;
  const perKmRate = 1.20;
  const perMinuteRate = 0.25;
  
  const distanceKm = distance / 1000;
  const durationMinutes = duration / 60;
  
  const subtotal = baseFare + (distanceKm * perKmRate) + (durationMinutes * perMinuteRate);
  const commission = subtotal * commissionRate;
  
  return subtotal + commission;
}

export function generateRideId(): string {
  return `ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateProposalId(): string {
  return `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
