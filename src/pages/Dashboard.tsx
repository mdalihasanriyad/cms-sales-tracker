import Header from '@/components/layout/Header';
import HeroSection from '@/components/dashboard/HeroSection';
import StatsCards from '@/components/dashboard/StatsCards';
import TargetProgress from '@/components/dashboard/TargetProgress';
import SalesCharts from '@/components/dashboard/SalesCharts';
import Leaderboard from '@/components/dashboard/Leaderboard';
import SalesTable from '@/components/dashboard/SalesTable';
import { currentUser, leaderboard, mockSales, getDashboardStats, chartData } from '@/data/mockData';

const Dashboard = () => {
  const stats = getDashboardStats(currentUser.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header user={currentUser} />
      
      <main className="container py-8 space-y-8">
        {/* Hero Section */}
        <HeroSection user={currentUser} />

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts & Sales */}
          <div className="lg:col-span-2 space-y-8">
            <SalesCharts 
              dailyData={chartData.daily} 
              monthlyData={chartData.monthly} 
            />
            <SalesTable sales={mockSales} />
          </div>

          {/* Right Column - Target & Leaderboard */}
          <div className="space-y-8">
            <TargetProgress stats={stats} />
            <Leaderboard entries={leaderboard} currentUserId={currentUser.id} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm font-display">CMS</span>
            </div>
            <span className="text-sm text-muted-foreground">
              © 2026 CMS Sales. All rights reserved.
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for the sales team
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
