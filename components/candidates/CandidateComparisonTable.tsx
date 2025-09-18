'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatPositionText } from '@/lib/textUtils';

interface Issue {
  id: string;
  slug: string;
  name: string;
  category: string;
  displayOrder: number;
}

interface Candidate {
  id: string;
  fullName: string;
  party: string;
  ballotName: string;
  incumbent: boolean;
  websiteUrl: string | null;
  photoUrl: string | null;
  residenceCity: string | null;
  occupation: string | null;
  summaryBio: string | null;
  displayOrder: number;
  issuePositions: Record<
    string,
    {
      positionSummary: string;
      stance: string;
      evidenceUrl: string | null;
    }
  >;
  endorsements: Array<{
    endorserName: string;
    endorserType: string;
    quote: string | null;
    sourceUrl: string | null;
  }>;
}

interface CandidateComparisonTableProps {
  candidates: Candidate[];
  issues: Issue[];
}

function getPartyColor(party: string): string {
  switch (party) {
    case 'R':
      return 'bg-red-500/20 text-red-300 border border-red-400/30';
    case 'D':
      return 'bg-blue-500/20 text-blue-300 border border-blue-400/30';
    case 'I':
      return 'bg-green-500/20 text-green-300 border border-green-400/30';
    default:
      return 'bg-slate-500/20 text-slate-300 border border-slate-400/30';
  }
}

function getPartyName(party: string): string {
  switch (party) {
    case 'R':
      return 'Republican';
    case 'D':
      return 'Democrat';
    case 'I':
      return 'Independent';
    default:
      return 'Other';
  }
}

function getIssueIcon(issueName: string): string {
  const name = issueName.toLowerCase();

  const iconMap = [
    { keywords: ['economy', 'tax'], icon: '💰' },
    { keywords: ['healthcare', 'health'], icon: '🏥' },
    { keywords: ['education', 'school'], icon: '🎓' },
    { keywords: ['reproductive', 'abortion'], icon: '🤱' },
    { keywords: ['safety', 'veteran', 'police'], icon: '🛡️' },
    { keywords: ['immigration', 'border'], icon: '🛂' },
    { keywords: ['environment', 'climate'], icon: '🌍' },
    { keywords: ['housing'], icon: '🏠' },
    { keywords: ['transportation', 'infrastructure'], icon: '🚗' },
    { keywords: ['justice', 'criminal', 'reform'], icon: '⚖️' },
    { keywords: ['foreign', 'defense'], icon: '🌐' },
    { keywords: ['civil', 'rights'], icon: '✊' },
  ];

  return (
    iconMap.find(({ keywords }) =>
      keywords.some((keyword) => name.includes(keyword))
    )?.icon ?? '📋'
  );
}

export default function CandidateComparisonTable({
  candidates,
  issues,
}: CandidateComparisonTableProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCandidates, setExpandedCandidates] = useState<Set<string>>(
    new Set()
  );

  const toggleCandidate = (candidateId: string) => {
    const newExpanded = new Set(expandedCandidates);
    if (newExpanded.has(candidateId)) {
      newExpanded.delete(candidateId);
    } else {
      newExpanded.add(candidateId);
    }
    setExpandedCandidates(newExpanded);
  };

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-2">
          No candidates found
        </h3>
        <p className="text-slate-300">
          Candidate information is not yet available for this election.
        </p>
      </div>
    );
  }

  // Mobile view: Stacked cards
  const MobileView = () => (
    <div className="space-y-6 md:hidden">
      {candidates.map((candidate) => {
        const isExpanded = expandedCandidates.has(candidate.id);

        return (
          <div
            key={candidate.id}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-2xl"
          >
            {/* Header section - always visible */}
            <div className="p-4">
              <div className="flex items-start gap-4">
                {candidate.photoUrl ? (
                  <Image
                    src={candidate.photoUrl}
                    alt={candidate.fullName}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-xl font-medium text-white">
                      {candidate.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">
                      {candidate.fullName}
                    </h3>
                    {candidate.incumbent && (
                      <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-400/30">
                        Incumbent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getPartyColor(
                        candidate.party
                      )}`}
                    >
                      {getPartyName(candidate.party)}
                    </span>
                    {candidate.occupation && (
                      <span className="text-sm text-slate-300">
                        {candidate.occupation}
                      </span>
                    )}
                  </div>
                  {candidate.summaryBio && (
                    <p className="text-sm text-slate-300 mb-2">
                      {candidate.summaryBio}
                    </p>
                  )}
                  {candidate.websiteUrl && (
                    <a
                      href={candidate.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </div>

              {/* Expand/Collapse button */}
              <button
                onClick={() => toggleCandidate(candidate.id)}
                className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 py-2 border-t border-white/10 transition-colors"
              >
                {isExpanded ? 'Hide' : 'Show'} Details
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Issue positions - collapsible */}
            {isExpanded && (
              <>
                {issues.map((issue) => {
                  const position = candidate.issuePositions[issue.slug];
                  return (
                    <div
                      key={issue.slug}
                      className="p-4 border-b border-white/10 last:border-b-0"
                    >
                      <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                        <span className="text-lg">
                          {getIssueIcon(issue.name)}
                        </span>
                        {issue.name}
                      </h4>
                      {position ? (
                        <div className="space-y-2">
                          {(() => {
                            const bulletPoints = formatPositionText(
                              position.positionSummary
                            );
                            if (bulletPoints.length <= 1) {
                              return (
                                <p className="text-sm text-slate-300">
                                  {position.positionSummary}
                                </p>
                              );
                            }
                            return (
                              <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                                {bulletPoints.map((point, idx) => (
                                  <li key={idx} className="leading-relaxed">
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            );
                          })()}
                          {position.evidenceUrl && (
                            <a
                              href={position.evidenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              Source →
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 italic">
                          No position stated
                        </p>
                      )}
                    </div>
                  );
                })}

                {candidate.endorsements.length > 0 && (
                  <div className="p-4 bg-white/5">
                    <h4 className="font-medium text-white mb-2">
                      Endorsements
                    </h4>
                    <div className="space-y-1">
                      {candidate.endorsements.map((endorsement, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium text-slate-200">
                            {endorsement.endorserName}
                          </span>
                          {endorsement.quote && (
                            <p className="text-slate-300 italic mt-1">
                              "{endorsement.quote}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );

  // Desktop view: Table
  const DesktopView = () => (
    <div className="hidden md:block overflow-x-auto">
      <table
        className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow-2xl"
        style={{ borderCollapse: 'separate', borderSpacing: 0 }}
      >
        <thead>
          <tr className="bg-white/10">
            <th className="text-left p-4 font-semibold text-white border-b border-white/20 min-w-48">
              Candidate
            </th>
            <th className="text-left p-4 font-semibold text-white border-b border-white/20 min-w-64">
              Background
            </th>
            {issues.map((issue) => (
              <th
                key={issue.slug}
                className="text-left p-4 font-semibold text-white border-b border-white/20 min-w-64"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getIssueIcon(issue.name)}</span>
                  {issue.name}
                </div>
              </th>
            ))}
            <th className="text-left p-4 font-semibold text-white border-b border-white/20 min-w-48">
              Endorsements
            </th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, candidateIdx) => (
            <tr
              key={candidate.id}
              className={candidateIdx % 2 === 0 ? 'bg-white/2' : 'bg-white/5'}
            >
              <td
                className={`p-4 align-top ${
                  candidateIdx < candidates.length - 1
                    ? 'border-b border-white'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {candidate.photoUrl ? (
                    <Image
                      src={candidate.photoUrl}
                      alt={candidate.fullName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-white">
                        {candidate.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">
                        {candidate.fullName}
                      </h3>
                      {candidate.incumbent && (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-400/30">
                          Incumbent
                        </span>
                      )}
                    </div>
                    <div className="mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getPartyColor(
                          candidate.party
                        )}`}
                      >
                        {getPartyName(candidate.party)}
                      </span>
                    </div>
                    {candidate.occupation && (
                      <p className="text-sm text-slate-300 mb-1">
                        {candidate.occupation}
                      </p>
                    )}
                    {candidate.residenceCity && (
                      <p className="text-sm text-slate-400">
                        {candidate.residenceCity}
                      </p>
                    )}
                    {candidate.websiteUrl && (
                      <a
                        href={candidate.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium mt-2 inline-block transition-colors"
                      >
                        Website →
                      </a>
                    )}
                  </div>
                </div>
              </td>

              <td
                className={`p-4 align-top ${
                  candidateIdx < candidates.length - 1
                    ? 'border-b border-white'
                    : ''
                }`}
              >
                <div className="space-y-2">
                  {candidate.summaryBio && (
                    <p className="text-sm text-slate-300">
                      {candidate.summaryBio}
                    </p>
                  )}
                  {!candidate.summaryBio && (
                    <p className="text-sm text-slate-400 italic">
                      No background provided
                    </p>
                  )}
                </div>
              </td>

              {issues.map((issue) => {
                const position = candidate.issuePositions[issue.slug];
                return (
                  <td
                    key={issue.slug}
                    className={`p-4 align-top ${
                      candidateIdx < candidates.length - 1
                        ? 'border-b border-white'
                        : ''
                    }`}
                  >
                    {position ? (
                      <div className="space-y-2">
                        {(() => {
                          const bulletPoints = formatPositionText(
                            position.positionSummary
                          );
                          if (bulletPoints.length <= 1) {
                            return (
                              <p className="text-sm text-slate-300">
                                {position.positionSummary}
                              </p>
                            );
                          }
                          return (
                            <ul className="text-sm text-slate-300 space-y-1 list-disc mb-0">
                              {bulletPoints.map((point, idx) => (
                                <li key={idx} className="">
                                  {point}
                                </li>
                              ))}
                            </ul>
                          );
                        })()}
                        {position.evidenceUrl && (
                          <a
                            href={position.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 inline-block transition-colors"
                          >
                            Source →
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        No position stated
                      </p>
                    )}
                  </td>
                );
              })}

              <td
                className={`p-4 align-top ${
                  candidateIdx < candidates.length - 1
                    ? 'border-b border-white'
                    : ''
                }`}
              >
                {candidate.endorsements.length > 0 ? (
                  <div className="space-y-2">
                    {candidate.endorsements
                      .slice(0, 3)
                      .map((endorsement, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium text-slate-200">
                            {endorsement.endorserName}
                          </span>
                          {endorsement.quote && (
                            <p className="text-slate-300 italic text-xs mt-1 line-clamp-2">
                              "{endorsement.quote}"
                            </p>
                          )}
                        </div>
                      ))}
                    {candidate.endorsements.length > 3 && (
                      <p className="text-xs text-slate-400">
                        +{candidate.endorsements.length - 3} more
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">None listed</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="mb-8">
      <MobileView />
      <DesktopView />
    </div>
  );
}
