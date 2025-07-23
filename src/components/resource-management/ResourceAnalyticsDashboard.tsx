import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Sankey, Rectangle } from "recharts";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourceAnalyticsProps {
  seniorityData: any[];
  skillData: any[];
  agingData: any[];
  engagementData: any[];
  onViewDetails?: (resource: any, type: 'seniority' | 'skill' | 'aging' | 'engagement') => void;
}

export const ResourceAnalyticsDashboard = ({ 
  seniorityData, 
  skillData, 
  agingData, 
  engagementData,
  onViewDetails 
}: ResourceAnalyticsProps) => {
  const chartConfig = {
    count: { label: "Count", color: "hsl(var(--chart-1))" },
    cost: { label: "Cost", color: "hsl(var(--chart-2))" },
    percentage: { label: "Percentage", color: "hsl(var(--chart-3))" },
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Sample time series data for trends
  const timeSeriesData = [
    { month: 'Jan', billable: 35, nonBillable: 26, interns: 3 },
    { month: 'Feb', billable: 38, nonBillable: 24, interns: 4 },
    { month: 'Mar', billable: 42, nonBillable: 22, interns: 3 },
    { month: 'Apr', billable: 45, nonBillable: 20, interns: 5 },
    { month: 'May', billable: 48, nonBillable: 18, interns: 4 },
    { month: 'Jun', billable: 50, nonBillable: 17, interns: 3 },
  ];

  // Radar chart data for skill competency
  const radarData = [
    { skill: 'Frontend', A: 120, B: 110, fullMark: 150 },
    { skill: 'Backend', A: 98, B: 130, fullMark: 150 },
    { skill: 'DevOps', A: 86, B: 130, fullMark: 150 },
    { skill: 'QA', A: 99, B: 100, fullMark: 150 },
    { skill: 'Data', A: 85, B: 90, fullMark: 150 },
    { skill: 'Mobile', A: 65, B: 85, fullMark: 150 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
                <h3 className="text-2xl font-bold">
                  {seniorityData.reduce((sum, item) => sum + item.count, 0)}
                </h3>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
                <h3 className="text-2xl font-bold">
                  ${(seniorityData.reduce((sum, item) => sum + item.monthlyCost, 0) / 1000).toFixed(0)}K
                </h3>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bench Resources</p>
                <h3 className="text-2xl font-bold">
                  {agingData.reduce((sum, item) => sum + item.count, 0)}
                </h3>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilization</p>
                <h3 className="text-2xl font-bold">85%</h3>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seniority Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Seniority Distribution</CardTitle>
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails(seniorityData[0], 'seniority')}
              >
                View Details
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seniorityData}>
                  <XAxis dataKey="level" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Skill Category Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Skill Categories</CardTitle>
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails(skillData[0], 'skill')}
              >
                View Details
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {skillData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Aging Analysis - Composed Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bench Aging vs Cost Analysis</CardTitle>
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails(agingData[0], 'aging')}
              >
                View Details
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={agingData}>
                  <XAxis dataKey="bucket" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="count" fill="var(--color-count)" />
                  <Line yAxisId="right" type="monotone" dataKey="avgDailyCost" stroke="var(--color-cost)" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Engagement Types */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Engagements</CardTitle>
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails(engagementData[0], 'engagement')}
              >
                View Details
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData} layout="horizontal">
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={timeSeriesData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="billable" stackId="1" stroke="var(--color-count)" fill="var(--color-count)" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="nonBillable" stackId="1" stroke="var(--color-cost)" fill="var(--color-cost)" fillOpacity={0.8} />
                  <Line type="monotone" dataKey="interns" stroke="var(--color-percentage)" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Skill Competency Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Competency Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis />
                  <Radar name="Current" dataKey="A" stroke="var(--color-count)" fill="var(--color-count)" fillOpacity={0.6} />
                  <Radar name="Target" dataKey="B" stroke="var(--color-cost)" fill="var(--color-cost)" fillOpacity={0.6} />
                  <ChartTooltip />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
