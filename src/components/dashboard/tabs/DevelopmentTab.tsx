import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Code, GitBranch, Bug, Zap } from "lucide-react";

export const DevelopmentTab = ({ engineeringMetrics }: { engineeringMetrics: any }) => {
  // Ensure metrics are mapped from both possible keys
  const metrics = engineeringMetrics?.development || engineeringMetrics?.developmentMetrics || {};
  const velocityData = engineeringMetrics?.velocityData || [];
  const codeQualityTrend = engineeringMetrics?.codeQualityTrend || [];
  return (
    <div className="space-y-6">
      {/* Development KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Coverage</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.codeCoverage}%</div>
            <Progress value={metrics.codeCoverage} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Quality</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.codeQuality}%</div>
            <Progress value={metrics.codeQuality} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Build Success</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.buildSuccess}%</div>
            <Progress value={metrics.buildSuccess} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Time</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.leadTime}</div>
            <p className="text-xs text-muted-foreground">Average delivery time</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Velocity */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Velocity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprint" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planned" fill="#e2e8f0" name="Planned" />
                <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Code Quality Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Code Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={codeQualityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={2} name="Quality Score" />
                <Line type="monotone" dataKey="coverage" stroke="#3b82f6" strokeWidth={2} name="Coverage %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Technical Debt - Full Width */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Development Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Technical Debt</span>
              <span className="text-sm text-muted-foreground">{metrics.technicalDebt}%</span>
            </div>
            <Progress value={metrics.technicalDebt} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Deployment Frequency</span>
              <span className="text-sm font-bold text-green-600">{metrics.deploymentFreq}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">24</div>
                <div className="text-xs text-gray-600">Active Branches</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">156</div>
                <div className="text-xs text-gray-600">Commits This Sprint</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
