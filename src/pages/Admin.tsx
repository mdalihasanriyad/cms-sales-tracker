import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTeam } from '@/hooks/useTeam';
import { useSales } from '@/hooks/useSales';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { exportTeamReportToPDF, exportSalesToPDF } from '@/utils/pdfExport';
import { Users, Target, TrendingUp, Download, Shield, Settings, UserCheck, FileText, Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

const Admin = () => {
  const { profile } = useAuth();
  const { teamMembers, isLoading: teamLoading, updateMemberRole, updateMemberTarget, updateMemberStatus } = useTeam();
  const { sales, isLoading: salesLoading } = useSales();
  const { toast } = useToast();
  
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [newTarget, setNewTarget] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRoleChange = (userId: string, role: AppRole) => {
    updateMemberRole.mutate({ userId, role });
  };

  const handleTargetUpdate = (userId: string) => {
    const target = parseFloat(newTarget);
    if (isNaN(target) || target <= 0) {
      toast({ title: 'Invalid target', description: 'Please enter a valid positive number', variant: 'destructive' });
      return;
    }
    updateMemberTarget.mutate({ userId, monthlyTarget: target });
    setEditingMember(null);
    setNewTarget('');
  };

  const handleStatusToggle = (userId: string, currentStatus: boolean) => {
    updateMemberStatus.mutate({ userId, isActive: !currentStatus });
  };

  const handleExportTeamReport = () => {
    exportTeamReportToPDF(teamMembers);
    toast({ title: 'Report exported', description: 'Team report has been downloaded as PDF' });
  };

  const handleExportAllSales = () => {
    exportSalesToPDF(sales, { title: 'All Sales Report', includeUser: true });
    toast({ title: 'Report exported', description: 'Sales report has been downloaded as PDF' });
  };

  // Calculate team stats
  const totalTeamSales = teamMembers.reduce((sum, m) => sum + m.total_sales, 0);
  const totalTeamTarget = teamMembers.reduce((sum, m) => sum + m.monthly_target, 0);
  const activeMembers = teamMembers.filter(m => m.is_active).length;
  const teamProgress = totalTeamTarget > 0 ? (totalTeamSales / totalTeamTarget) * 100 : 0;

  const statCards = [
    {
      title: 'Team Members',
      value: teamMembers.length.toString(),
      subtitle: `${activeMembers} active`,
      icon: <Users className="h-5 w-5" />,
      color: 'text-primary',
    },
    {
      title: 'Total Sales',
      value: formatCurrency(totalTeamSales),
      subtitle: `${sales.length} transactions`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-green-500',
    },
    {
      title: 'Team Target',
      value: formatCurrency(totalTeamTarget),
      subtitle: `${teamProgress.toFixed(1)}% achieved`,
      icon: <Target className="h-5 w-5" />,
      color: 'text-blue-500',
    },
    {
      title: 'Admins',
      value: teamMembers.filter(m => m.role === 'admin').length.toString(),
      subtitle: 'with full access',
      icon: <Shield className="h-5 w-5" />,
      color: 'text-purple-500',
    },
  ];

  if (teamLoading || salesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Header />
        <div className="container py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="container py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your team and monitor performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportTeamReport}>
              <Download className="h-4 w-4 mr-2" />
              Team Report
            </Button>
            <Button variant="outline" onClick={handleExportAllSales}>
              <FileText className="h-4 w-4 mr-2" />
              Sales Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} variant="elevated">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="team" className="space-y-6">
          <TabsList>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              Team Management
            </TabsTrigger>
            <TabsTrigger value="sales" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              All Sales
            </TabsTrigger>
          </TabsList>

          {/* Team Management Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage roles, targets, and status for all team members</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Target</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Progress</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => {
                      const progress = member.monthly_target > 0 
                        ? (member.total_sales / member.monthly_target) * 100 
                        : 0;
                      const isCurrentUser = member.id === profile?.id;

                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={member.avatar_url || ''} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {(member.full_name || member.email)[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.full_name || member.email.split('@')[0]}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                              </div>
                              {isCurrentUser && (
                                <Badge variant="secondary" className="text-xs">You</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={member.role}
                              onValueChange={(value: AppRole) => handleRoleChange(member.id, value)}
                              disabled={isCurrentUser}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            {editingMember === member.id ? (
                              <div className="flex items-center gap-2 justify-end">
                                <Input
                                  type="number"
                                  value={newTarget}
                                  onChange={(e) => setNewTarget(e.target.value)}
                                  className="w-28"
                                  placeholder="Target"
                                />
                                <Button size="sm" onClick={() => handleTargetUpdate(member.id)}>
                                  Save
                                </Button>
                              </div>
                            ) : (
                              formatCurrency(member.monthly_target)
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(member.total_sales)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={progress >= 100 ? 'default' : progress >= 50 ? 'secondary' : 'outline'}>
                              {progress.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={member.is_active}
                              onCheckedChange={() => handleStatusToggle(member.id, member.is_active)}
                              disabled={isCurrentUser}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingMember(member.id);
                                setNewTarget(member.monthly_target.toString());
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Sales Tab */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>All Sales Records</CardTitle>
                <CardDescription>View all sales across the team</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sales Person</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.slice(0, 50).map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>
                          {new Date(sale.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          {sale.profiles?.full_name || sale.profiles?.email || 'Unknown'}
                        </TableCell>
                        <TableCell>{sale.client_name}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(Number(sale.amount))}
                        </TableCell>
                        <TableCell className="text-center">
                          {sale.is_locked ? (
                            <Badge variant="secondary">Locked</Badge>
                          ) : (
                            <Badge variant="outline">Open</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
            Admin Panel - Manage with care ⚡
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
