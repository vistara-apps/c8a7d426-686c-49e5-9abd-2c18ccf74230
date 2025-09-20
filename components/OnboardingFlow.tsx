'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { StatusIndicator } from './StatusIndicator';
import { Shield, Car, CheckCircle } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'identity',
      title: 'Verify Identity',
      description: 'Connect your Farcaster account',
      completed: true, // Assume already connected
    },
    {
      id: 'vehicle',
      title: 'Vehicle Information',
      description: 'Add your vehicle details',
      completed: false,
    },
    {
      id: 'verification',
      title: 'Driver Verification',
      description: 'Complete verification process',
      completed: false,
    },
    {
      id: 'nft',
      title: 'Mint Driver NFT',
      description: 'Get your driver credentials',
      completed: false,
    },
  ]);

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Vehicle information step
      if (!vehicleDetails || !licenseNumber) return;

      setIsSubmitting(true);

      try {
        // Create driver profile via API
        const response = await fetch('/api/drivers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'demo-driver', // In production, get from authenticated user
            vehicleDetails,
            licenseNumber,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create driver profile');
        }

        const profileData = await response.json();
        console.log('Driver profile created:', profileData);

        setIsSubmitting(false);

        // Mark current step as completed
        const updatedSteps = [...steps];
        updatedSteps[currentStep].completed = true;
        setSteps(updatedSteps);
      } catch (error) {
        console.error('Error creating driver profile:', error);
        setIsSubmitting(false);
        // In production, show error message to user
        return;
      }
    }

    if (currentStep === 2) {
      // Verification step
      setIsSubmitting(true);

      try {
        // Verify driver profile via API
        const response = await fetch('/api/drivers', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'demo-driver', // In production, get from authenticated user
            action: 'verify',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to verify driver');
        }

        const verifiedProfile = await response.json();
        console.log('Driver verified:', verifiedProfile);

        setIsSubmitting(false);

        const updatedSteps = [...steps];
        updatedSteps[currentStep].completed = true;
        setSteps(updatedSteps);
      } catch (error) {
        console.error('Error verifying driver:', error);
        setIsSubmitting(false);
        // In production, show error message to user
        return;
      }
    }

    if (currentStep === 3) {
      // NFT minting step
      setIsSubmitting(true);

      try {
        // Mint driver NFT via API
        const response = await fetch('/api/nft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'demo-driver', // In production, get from authenticated user
            driverProfile: {
              vehicleDetails,
              licenseNumber,
              verificationStatus: 'verified',
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to mint NFT');
        }

        const nftData = await response.json();
        console.log('NFT minted:', nftData);

        setIsSubmitting(false);

        const updatedSteps = [...steps];
        updatedSteps[currentStep].completed = true;
        setSteps(updatedSteps);

        // Onboarding complete
        return;
      } catch (error) {
        console.error('Error minting NFT:', error);
        setIsSubmitting(false);
        // In production, show error message to user
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const isAllCompleted = steps.every(step => step.completed);

  if (isAllCompleted) {
    return (
      <Card className="text-center">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Welcome to RideShift!</h3>
            <p className="text-sm text-gray-600 mt-1">
              You're now verified and ready to start driving.
            </p>
          </div>
          <StatusIndicator status="active">
            Verified Driver
          </StatusIndicator>
        </div>
      </Card>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-gray-900">Become a Driver</h2>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step.completed 
                  ? 'bg-accent text-white' 
                  : index === currentStep 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {step.completed ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  step.completed ? 'bg-accent' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Current step content */}
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-gray-900">{currentStepData.title}</h3>
            <p className="text-sm text-gray-600">{currentStepData.description}</p>
          </div>

          {currentStep === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">Farcaster account connected</span>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Details
                </label>
                <Input
                  placeholder="e.g., 2020 Toyota Camry, Blue"
                  value={vehicleDetails}
                  onChange={(e) => setVehicleDetails(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <Input
                  placeholder="Driver's license number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-start space-x-2">
                <Car className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Verification in Progress</p>
                  <p className="text-xs text-blue-600 mt-1">
                    We're reviewing your information. This usually takes a few minutes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3">
              <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-purple-800 font-medium">Driver NFT</p>
                  <p className="text-xs text-purple-600 mt-1">
                    Mint your driver credentials as an NFT
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                This will require a small gas fee to mint on Base
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleNextStep}
          loading={isSubmitting}
          disabled={currentStep === 1 && (!vehicleDetails || !licenseNumber)}
          className="w-full"
        >
          {isSubmitting 
            ? currentStep === 2 
              ? 'Verifying...' 
              : currentStep === 3 
                ? 'Minting NFT...' 
                : 'Processing...'
            : currentStep === 3 
              ? 'Mint Driver NFT' 
              : 'Continue'
          }
        </Button>
      </div>
    </Card>
  );
}
