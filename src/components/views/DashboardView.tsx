'use client';

import { useAIEOStore } from '@/lib/store';
import {
  DashboardHero,
  DashboardMetrics,
  DashboardFeaturedAgents,
  DashboardOnboardingSteps,
  DashboardCategories,
  DashboardRecentTasks,
} from './dashboard';

export default function DashboardView() {
  const setView = useAIEOStore(s => s.setView);

  return (
    <div className="space-y-20">
      <DashboardHero onNavigate={setView} />
      <DashboardMetrics />
      <DashboardFeaturedAgents onNavigate={setView} />
      <DashboardOnboardingSteps />
      <DashboardCategories onNavigate={setView} />
      <DashboardRecentTasks onNavigate={setView} />
    </div>
  );
}
