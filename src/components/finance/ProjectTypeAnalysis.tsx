
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, BarChart3, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

interface ProjectFinancials {
  projectId: string;
  projectName: string;
  projectType: "Fixed Price" | "T&M" | "Milestone";
  client: string;
  sowValue: number;
  billingRate: string;
  startDate: string;
  endDate: string;
  actualCostToDate: number;
  billableResources: number;
  nonBillableResources: number;
  shadowResources: number;
  monthlyBurn: number;
  projectedCompletion: string;
  netPosition: number;
  healthStatus: "Positive" | "Negative" | "Critical";
  profitMargin: number;
  utilizationRate: number;
  resourceCosts: {
    billableCost: number;
    nonBillableCost: number;
    shadowCost: number;
  };
}

interface ProjectTypeAnalysisProps {
  projects: ProjectFinancials[];
}

export const ProjectTypeAnalysis = ({ projects }: ProjectTypeAnalysisProps) => {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  // Analyze by project type
  const projectTypeAnalysis = projects.reduce((acc, project) => {
    const type = project.projectType;
    if (!acc[type]) {
      acc[type] = {
        count: 0,
        totalSOW: 0,
        totalActual: 0,
        totalNetPosition: 0,
        avgMargin: 0,
        projects: []
      };
    }
    acc[type].count += 1;
    acc[type].totalSOW += project.sowValue;
    acc[type].totalActual += project.actualCostToDate;
    acc[type].totalNetPosition += project.netPosition;
    acc[type].projects.push(project);
    return acc;
  }, {} as Record<string, any>);

  // Calculate average margins
  Object.keys(projectTypeAnalysis).forEach(type => {
    const data = projectTypeAnalysis[type];
    data.avgMargin = data.projects.reduce((sum: number, p: ProjectFinancials) => sum + p.profitMargin, 0) / data.count;
  });

  // Prepare chart data
  const chartData = Object.entries(projectTypeAnalysis).map(([type, data]) => ({
    name: type,
    SOW: data.totalSOW,
    Actual: data.totalActual,
    Net: data.totalNetPosition,
    Margin: data.avgMargin,
    count: data.count
  }));

  const pieData = Object.entries(projectTypeAnalysis).map(([type, data]) => ({
    name: type,
    value: data.totalSOW,
    count: data.count
  }));

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6'];

  // Client analysis
  const clientAnalysis = projects.reduce((acc, project) => {
    const client = project.client;
    if (!acc[client]) {
      acc[client] = {
        count: 0,
        totalSOW: 0,
        totalActual: 0,
        netPosition: 0
      };
    }
    acc[client].count += 1;
    acc[client].totalSOW += project.sowValue;
    acc[client].totalActual += project.actualCostToDate;
    acc[client].netPosition += project.netPosition;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      {/* Project Type Performance */}
      <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Project Type Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4">SOW vs Actual Costs by Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="SOW" fill="#10b981" name="SOW Value" />
                  <Bar dataKey="Actual" fill="#f97316" name="Actual Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4">SOW Distribution by Project Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Summary Table */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Project Type Performance Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Project Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Count</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Total SOW</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actual Cost</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Net Position</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Avg Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(projectTypeAnalysis).map(([type, data]: [string, any]) => (
                    <tr key={type} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Badge className="bg-purple-100 text-purple-800">{type}</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">{data.count}</td>
                      <td className="py-3 px-4 font-medium text-green-600">{formatCurrency(data.totalSOW)}</td>
                      <td className="py-3 px-4 font-medium text-orange-600">{formatCurrency(data.totalActual)}</td>
                      <td className="py-3 px-4 font-medium">
                        <span className={data.totalNetPosition > 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(data.totalNetPosition)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        <span className={data.avgMargin > 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatPercentage(data.avgMargin)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Analysis */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-500" />
            Client Financial Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(clientAnalysis).map(([client, data]: [string, any]) => (
              <div key={client} className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <div className="font-medium text-blue-900">{client}</div>
                  <div className="text-sm text-blue-700">{data.count} project{data.count > 1 ? 's' : ''}</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-medium text-blue-600">{formatCurrency(data.totalSOW)}</div>
                  <div className="text-sm text-blue-700">
                    Net: <span className={data.netPosition > 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(data.netPosition)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
