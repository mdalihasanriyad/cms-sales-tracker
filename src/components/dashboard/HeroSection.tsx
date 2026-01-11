import { Calendar, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';

interface HeroSectionProps {
  user: User;
}

const HeroSection = ({ user }: HeroSectionProps) => {
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-bg p-8 md:p-12 animate-fade-in">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                <Calendar className="h-3 w-3 mr-1" />
                {monthYear}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm capitalize">
                {user.role}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-display">
              {getGreeting()}, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-lg text-white/80 max-w-xl">
              Track your sales performance, hit your targets, and climb the leaderboard.
              Let's make this month your best yet!
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="relative">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Sparkles className="h-16 w-16 md:h-20 md:w-20 text-white animate-float" />
              </div>
              <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-xl gradient-bg opacity-50 blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
