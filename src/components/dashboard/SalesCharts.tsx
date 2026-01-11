import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface SalesChartsProps {
  dailyData: { day: string; sales: number }[];
  monthlyData: { month: string; sales: number }[];
}

const SalesCharts = ({ dailyData, monthlyData }: SalesChartsProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg p-3 shadow-lg border border-border">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-lg font-bold gradient-text">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cms-blue/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-cms-blue" />
          </div>
          <CardTitle className="text-xl">Sales Analytics</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="daily" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Daily Sales
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Monthly Trend
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="sales" 
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--cms-pink))" />
                      <stop offset="100%" stopColor="hsl(var(--cms-purple))" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--cms-purple))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--cms-blue))" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--cms-purple))"
                    strokeWidth={3}
                    fill="url(#areaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalesCharts;
