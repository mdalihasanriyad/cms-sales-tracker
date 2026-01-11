import { User, Sale, LeaderboardEntry, DashboardStats } from '@/types';

export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@cmssales.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'user',
  monthlyTarget: 15000,
  isActive: true,
  joinedAt: new Date('2024-01-15'),
};

export const teamMembers: User[] = [
  currentUser,
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah@cmssales.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'user',
    monthlyTarget: 20000,
    isActive: true,
    joinedAt: new Date('2023-08-20'),
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@cmssales.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    role: 'user',
    monthlyTarget: 18000,
    isActive: true,
    joinedAt: new Date('2023-11-10'),
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@cmssales.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    role: 'admin',
    monthlyTarget: 25000,
    isActive: true,
    joinedAt: new Date('2022-05-01'),
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james@cmssales.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    role: 'user',
    monthlyTarget: 12000,
    isActive: true,
    joinedAt: new Date('2024-02-28'),
  },
];

export const mockSales: Sale[] = [
  {
    id: '1',
    userId: '1',
    date: new Date('2025-01-02'),
    amount: 1250,
    clientName: 'TechCorp Solutions',
    monthYear: '2025-01',
    isLocked: false,
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
  },
  {
    id: '2',
    userId: '1',
    date: new Date('2025-01-05'),
    amount: 890,
    clientName: 'Digital Innovators',
    monthYear: '2025-01',
    isLocked: false,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: '3',
    userId: '1',
    date: new Date('2025-01-08'),
    amount: 2100,
    clientName: 'StartupXYZ',
    monthYear: '2025-01',
    isLocked: false,
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-08'),
  },
  {
    id: '4',
    userId: '1',
    date: new Date('2025-01-10'),
    amount: 1500,
    clientName: 'GlobalMedia Inc',
    monthYear: '2025-01',
    isLocked: false,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: '5',
    userId: '1',
    date: new Date('2025-01-11'),
    amount: 750,
    clientName: 'Creative Agency',
    monthYear: '2025-01',
    isLocked: false,
    createdAt: new Date('2025-01-11'),
    updatedAt: new Date('2025-01-11'),
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, user: teamMembers[1], totalSales: 18500, targetPercentage: 92.5 },
  { rank: 2, user: teamMembers[3], totalSales: 22000, targetPercentage: 88 },
  { rank: 3, user: teamMembers[2], totalSales: 14200, targetPercentage: 78.9 },
  { rank: 4, user: teamMembers[0], totalSales: 6490, targetPercentage: 43.3 },
  { rank: 5, user: teamMembers[4], totalSales: 4800, targetPercentage: 40 },
];

export const getDashboardStats = (userId: string): DashboardStats => {
  const userSales = mockSales.filter(s => s.userId === userId);
  const totalSales = userSales.reduce((sum, s) => sum + s.amount, 0);
  const user = teamMembers.find(u => u.id === userId) || currentUser;
  
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysRemaining = lastDay.getDate() - today.getDate();
  const remaining = Math.max(0, user.monthlyTarget - totalSales);
  const dailyRequired = daysRemaining > 0 ? remaining / daysRemaining : remaining;

  return {
    totalSales,
    targetProgress: Math.min((totalSales / user.monthlyTarget) * 100, 100),
    monthlyTarget: user.monthlyTarget,
    salesCount: userSales.length,
    dailyRequired: Math.round(dailyRequired),
    daysRemaining,
  };
};

export const chartData = {
  daily: [
    { day: 'Jan 1', sales: 0 },
    { day: 'Jan 2', sales: 1250 },
    { day: 'Jan 3', sales: 0 },
    { day: 'Jan 4', sales: 0 },
    { day: 'Jan 5', sales: 890 },
    { day: 'Jan 6', sales: 0 },
    { day: 'Jan 7', sales: 0 },
    { day: 'Jan 8', sales: 2100 },
    { day: 'Jan 9', sales: 0 },
    { day: 'Jan 10', sales: 1500 },
    { day: 'Jan 11', sales: 750 },
  ],
  monthly: [
    { month: 'Aug', sales: 8500 },
    { month: 'Sep', sales: 12000 },
    { month: 'Oct', sales: 9800 },
    { month: 'Nov', sales: 15200 },
    { month: 'Dec', sales: 11500 },
    { month: 'Jan', sales: 6490 },
  ],
  teamComparison: teamMembers.map(member => ({
    name: member.name.split(' ')[0],
    sales: leaderboard.find(l => l.user.id === member.id)?.totalSales || 0,
    target: member.monthlyTarget,
  })),
};
