export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  monthlyTarget: number;
  isActive: boolean;
  joinedAt: Date;
}

export interface Sale {
  id: string;
  userId: string;
  date: Date;
  amount: number;
  clientName: string;
  monthYear: string;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlyMeta {
  id: string;
  monthYear: string;
  teamTarget: number;
  isLocked: boolean;
  createdBy: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  totalSales: number;
  targetPercentage: number;
}

export interface DashboardStats {
  totalSales: number;
  targetProgress: number;
  monthlyTarget: number;
  salesCount: number;
  dailyRequired: number;
  daysRemaining: number;
}
