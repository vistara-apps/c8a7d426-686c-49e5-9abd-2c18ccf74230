import { AppShell } from '@/components/AppShell';
import { RideRequestForm } from '@/components/RideRequestForm';
import { DriverDashboard } from '@/components/DriverDashboard';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { GovernancePanel } from '@/components/GovernancePanel';

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="text-center py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            RideShift
          </h1>
          <p className="text-sm text-gray-600 leading-5">
            Decentralized Rideshare, Fairer Fares.
          </p>
        </div>

        {/* Main Features */}
        <div className="space-y-4">
          <RideRequestForm />
          <DriverDashboard />
          <OnboardingFlow />
          <GovernancePanel />
        </div>
      </div>
    </AppShell>
  );
}
