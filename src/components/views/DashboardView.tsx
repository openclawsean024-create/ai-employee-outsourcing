'use client';

import { useAIEOStore } from '@/lib/store';
import {
  DashboardHero,
  DashboardMetrics,
  DashboardFeaturedAgents,
  DashboardOnboardingSteps,
  DashboardCategories,
  DashboardRecentTasks,
  DashboardPricing,
  DashboardFooter,
} from './dashboard';

export default function DashboardView() {
  const setView = useAIEOStore(s => s.setView);
  const settings = useAIEOStore(s => s.settings);

  return (
    <div className="space-y-20">
      <DashboardHero onNavigate={setView} />
      <DashboardMetrics />
      <DashboardFeaturedAgents onNavigate={setView} />
      <DashboardOnboardingSteps />
      <DashboardCategories onNavigate={setView} />
      <DashboardRecentTasks onNavigate={setView} />
      <DashboardPricing currentTier={settings.tier} onNavigate={setView} />
      <DashboardFooter onNavigate={setView} />
    </div>
  );
}
