
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TestTube, Bug, CheckCircle, AlertTriangle } from "lucide-react";

export const QATab = () => {
  const qaMetrics = {
    testCoverage: 78,
    passRate: 94,
    automationRate: 85,
    defectDensity: 2.1
  };

  const defectTrend = [
    { sprint: "Sprint 11", found: 15, fixed: 14, remaining: 1 },
    { sprint: "Sprint 12", found: 12, fixed: 11, remaining: 2 },
    { sprint: "Sprint 13", found: 8, fixed: 9, remaining: 1 },
    { sprint: "Sprint 14", found: 10, fixed: 8, remaining: 3 },
    { sprint: "Sprint 15", found: 6, fixed: 7, remaining: 2 }
  ];

  const defectDistribution = [
    { type: "UI", count: 4, percentage: 22 },
    { type: "Functional", count: 8, percentage: 44 },
    { type: "Performance", count: 2, percentage: 11 },
    { type: "Security", count: 1, percentage: 6 },
    { type: "Integration", count: 3, percentage: 17 }
  ];

  const testAutomationData = [
    { category: "Unit Tests", manual: 20, automated: 180, total: 200 },
    { category: "Integration", manual: 35, automated: 65, total: 100 },
    { category: "E2E Tests", manual: 25, automated: 35, total: 60 },
    { category: "API Tests", manual: 10, automated: 90, total: 100 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* QA KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Coverage</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qaMetrics.testCoverage}%</div>
            <Progress value={qaMetrics.testCoverage} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qaMetrics.passRate}%</div>
            <Progress value={qaMetrics.passRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation Rate</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qaMetrics.automationRate}%</div>
            <Progress value={qaMetrics.automationRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Defect Density</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qaMetrics.defectDensity}</div>
            <p className="text-xs text-muted-foreground">Per 1000 lines of code</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Defect Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Defect Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={defectTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sprint" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="found" stroke="#ef4444" strokeWidth={2} name="Found" />
                <Line type="monotone" dataKey="fixed" stroke="#10b981" strokeWidth={2} name="Fixed" />
                <Line type="monotone" dataKey="remaining" stroke="#f59e0b" strokeWidth={2} name="Remaining" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Defect Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Defect Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={defectDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {defectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {defectDistribution.map((item, index) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.type}: {item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Automation - Full Width */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Test Automation Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testAutomationData.map((test, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{test.category}</span>
                    <span className="text-sm text-gray-600">
                      {Math.round((test.automated / test.total) * 100)}% automated
                    </span>
                  </div>
                  <div className="flex w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-l-full"
                      style={{ width: `${(test.automated / test.total) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-orange-400 h-2 rounded-r-full"
                      style={{ width: `${(test.manual / test.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Automated: {test.automated}</span>
                    <span>Manual: {test.manual}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
