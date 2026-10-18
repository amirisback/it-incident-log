'use client';

import React, { useState } from 'react';
import { SpbeHeader } from './spbe-header';
import { IncidentDashboard } from './incident-dashboard';
import { Incident, IncidentStats } from '@/types/incident';

interface HomeContainerProps {
  initialIncidents: Incident[];
  initialStats: IncidentStats;
}

export function HomeContainer({
  initialIncidents,
  initialStats,
}: HomeContainerProps): React.JSX.Element {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <>
      <SpbeHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <IncidentDashboard
          initialIncidents={initialIncidents}
          initialStats={initialStats}
          isReportModalOpen={isReportModalOpen}
          onCloseReportModal={() => setIsReportModalOpen(false)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
      </main>
    </>
  );
}
