import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CandidateComparisonTable from '@/components/candidates/CandidateComparisonTable'

const mockCandidates = [
  {
    id: '1',
    fullName: 'John Smith',
    party: 'D',
    ballotName: 'John Smith',
    incumbent: false,
    websiteUrl: null,
    photoUrl: null,
    residenceCity: null,
    occupation: 'Teacher',
    summaryBio: 'Local educator with 15 years experience',
    displayOrder: 1,
    issuePositions: {
      'economy': {
        positionSummary: 'Support small business growth',
        stance: 'support',
        evidenceUrl: null,
      }
    },
    endorsements: []
  }
]

const mockIssues = [
  {
    id: '1',
    slug: 'economy',
    name: 'Economy & Taxes',
    category: 'economy',
    displayOrder: 1,
  }
]

describe('CandidateComparisonTable', () => {
  it('renders candidates', () => {
    render(
      <CandidateComparisonTable candidates={mockCandidates} issues={mockIssues} />
    )

    // Use getAllByText since the name appears in both mobile and desktop views
    expect(screen.getAllByText('John Smith')).toHaveLength(2)
    expect(screen.getAllByText('Teacher')).toHaveLength(2)
  })

  it('shows no candidates message when empty', () => {
    render(
      <CandidateComparisonTable candidates={[]} issues={mockIssues} />
    )

    expect(screen.getByText('No candidates found')).toBeInTheDocument()
  })

  it('toggles mobile card expansion', () => {
    render(
      <CandidateComparisonTable candidates={mockCandidates} issues={mockIssues} />
    )

    const showButton = screen.getByText('Show Details')
    fireEvent.click(showButton)
    
    expect(screen.getByText('Hide Details')).toBeInTheDocument()
  })
})