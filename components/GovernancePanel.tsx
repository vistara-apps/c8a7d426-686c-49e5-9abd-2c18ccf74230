'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { StatusIndicator } from './StatusIndicator';
import { formatCurrency } from '@/lib/utils';
import { COMMISSION_RATES } from '@/lib/constants';
import { Vote, TrendingUp, Users } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  currentRate: number;
  proposedRate: number;
  votes: number;
  status: 'pending' | 'approved' | 'rejected';
  timeLeft: string;
}

const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Reduce Commission Rate',
    description: 'Lower platform commission from 15% to 12% to attract more drivers',
    currentRate: 0.15,
    proposedRate: 0.12,
    votes: 127,
    status: 'pending',
    timeLeft: '2 days'
  },
  {
    id: '2',
    title: 'Peak Hour Adjustment',
    description: 'Increase commission to 18% during peak hours (7-9 AM, 5-7 PM)',
    currentRate: 0.15,
    proposedRate: 0.18,
    votes: 89,
    status: 'pending',
    timeLeft: '5 days'
  }
];

export function GovernancePanel() {
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [newProposalRate, setNewProposalRate] = useState('');
  const [newProposalDescription, setNewProposalDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingFor, setVotingFor] = useState<string | null>(null);

  const handleCreateProposal = async () => {
    if (!newProposalRate || !newProposalDescription) return;

    setIsSubmitting(true);

    try {
      // Create proposal via API
      const response = await fetch('/api/governance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposerId: 'demo-user', // In production, get from authenticated user
          newRate: parseFloat(newProposalRate),
          description: newProposalDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create proposal');
      }

      const proposalData = await response.json();
      console.log('Proposal created:', proposalData);

      setIsSubmitting(false);
      setShowCreateProposal(false);
      setNewProposalRate('');
      setNewProposalDescription('');
    } catch (error) {
      console.error('Error creating proposal:', error);
      setIsSubmitting(false);
      // In production, show error message to user
    }
  };

  const handleVote = async (proposalId: string, support: boolean) => {
    setVotingFor(proposalId);

    try {
      // Vote on proposal via API
      const response = await fetch('/api/governance', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposalId,
          voterId: 'demo-user', // In production, get from authenticated user
          action: support ? 'support' : 'oppose',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote on proposal');
      }

      const updatedProposal = await response.json();
      console.log('Vote recorded:', updatedProposal);

      setVotingFor(null);
    } catch (error) {
      console.error('Error voting on proposal:', error);
      setVotingFor(null);
      // In production, show error message to user
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Vote className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-gray-900">Governance</h2>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowCreateProposal(!showCreateProposal)}
          >
            {showCreateProposal ? 'Cancel' : 'Propose'}
          </Button>
        </div>

        {/* Current Commission Rate */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Current Commission Rate</p>
              <p className="text-xs text-blue-700">Applied to all rides</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-blue-900">15%</p>
            </div>
          </div>
        </div>

        {/* Create Proposal Form */}
        {showCreateProposal && (
          <div className="border border-gray-200 rounded-md p-3 space-y-3">
            <h3 className="font-medium text-gray-900">Create Proposal</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposed Rate (%)
              </label>
              <Input
                type="number"
                min={COMMISSION_RATES.MIN * 100}
                max={COMMISSION_RATES.MAX * 100}
                step="0.1"
                placeholder="e.g., 12.5"
                value={newProposalRate}
                onChange={(e) => setNewProposalRate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="input-bordered w-full h-20 resize-none"
                placeholder="Explain why this change would benefit the community..."
                value={newProposalDescription}
                onChange={(e) => setNewProposalDescription(e.target.value)}
              />
            </div>

            <Button
              onClick={handleCreateProposal}
              loading={isSubmitting}
              disabled={!newProposalRate || !newProposalDescription}
              className="w-full"
            >
              {isSubmitting ? 'Creating Proposal...' : 'Create Proposal'}
            </Button>
          </div>
        )}

        {/* Active Proposals */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Active Proposals</h3>
          
          {mockProposals.map((proposal) => (
            <div key={proposal.id} className="border border-gray-200 rounded-md p-3 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900">{proposal.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{proposal.description}</p>
                </div>
                <StatusIndicator status="pending">
                  {proposal.status}
                </StatusIndicator>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      {(proposal.currentRate * 100).toFixed(1)}% → {(proposal.proposedRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{proposal.votes} votes</span>
                  </div>
                </div>
                <span className="text-gray-500">{proposal.timeLeft} left</span>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleVote(proposal.id, true)}
                  loading={votingFor === proposal.id}
                  className="flex-1"
                >
                  Support
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleVote(proposal.id, false)}
                  loading={votingFor === proposal.id}
                  className="flex-1"
                >
                  Oppose
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Governance Stats */}
        <div className="bg-gray-50 rounded-md p-3">
          <h4 className="font-medium text-sm text-gray-900 mb-2">Community Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-gray-900">1,247</p>
              <p className="text-xs text-gray-600">Total Voters</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">23</p>
              <p className="text-xs text-gray-600">Proposals</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
