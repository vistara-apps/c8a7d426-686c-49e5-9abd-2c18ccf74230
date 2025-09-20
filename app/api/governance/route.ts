import { NextRequest, NextResponse } from 'next/server';
import { CommissionProposal } from '@/lib/types';
import { generateProposalId } from '@/lib/utils';

// Mock database - replace with real database in production
let proposals: CommissionProposal[] = [
  {
    proposalId: 'prop_001',
    proposerId: 'demo-user',
    newRate: 0.12,
    status: 'pending',
    creationTimestamp: Date.now() - 86400000, // 1 day ago
    voteCount: 45,
  },
  {
    proposalId: 'prop_002',
    proposerId: 'demo-driver',
    newRate: 0.18,
    status: 'pending',
    creationTimestamp: Date.now() - 172800000, // 2 days ago
    voteCount: 23,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const proposerId = searchParams.get('proposerId');

    let filteredProposals = proposals;

    if (status) {
      filteredProposals = filteredProposals.filter(proposal => proposal.status === status);
    }

    if (proposerId) {
      filteredProposals = filteredProposals.filter(proposal => proposal.proposerId === proposerId);
    }

    return NextResponse.json(filteredProposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposerId, newRate } = body;

    if (!proposerId || typeof newRate !== 'number') {
      return NextResponse.json(
        { error: 'proposerId and newRate are required' },
        { status: 400 }
      );
    }

    // Validate rate range
    if (newRate < 0.05 || newRate > 0.25) {
      return NextResponse.json(
        { error: 'Commission rate must be between 5% and 25%' },
        { status: 400 }
      );
    }

    const newProposal: CommissionProposal = {
      proposalId: generateProposalId(),
      proposerId,
      newRate,
      status: 'pending',
      creationTimestamp: Date.now(),
      voteCount: 0,
    };

    proposals.push(newProposal);

    return NextResponse.json(newProposal, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId, ...updates } = body;

    if (!proposalId) {
      return NextResponse.json(
        { error: 'proposalId is required' },
        { status: 400 }
      );
    }

    const proposalIndex = proposals.findIndex(p => p.proposalId === proposalId);
    if (proposalIndex === -1) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Update proposal
    proposals[proposalIndex] = { ...proposals[proposalIndex], ...updates };

    return NextResponse.json(proposals[proposalIndex]);
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Vote on proposal
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId, voterId, action } = body;

    if (!proposalId || !voterId || !action) {
      return NextResponse.json(
        { error: 'proposalId, voterId, and action are required' },
        { status: 400 }
      );
    }

    const proposalIndex = proposals.findIndex(p => p.proposalId === proposalId);
    if (proposalIndex === -1) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const proposal = proposals[proposalIndex];

    if (proposal.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only vote on pending proposals' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'support':
        proposals[proposalIndex] = {
          ...proposal,
          voteCount: proposal.voteCount + 1,
        };
        break;

      case 'oppose':
        proposals[proposalIndex] = {
          ...proposal,
          voteCount: proposal.voteCount - 1,
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "support" or "oppose"' },
          { status: 400 }
        );
    }

    return NextResponse.json(proposals[proposalIndex]);
  } catch (error) {
    console.error('Error voting on proposal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

