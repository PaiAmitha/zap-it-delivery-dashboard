import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Users, Building, AlertTriangle, CheckCircle } from "lucide-react";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { useGlobalDate } from "@/contexts/GlobalDateContext";
import { useEffect, useState } from "react";
import { getFinance } from "@/lib/api";

const FinancialDepartment = () => {
  const { selectedDateRange } = useGlobalDate();

  // Use real-time data updates
  const { refreshData } = useRealtimeData({
    onDataUpdate: (dateRange) => {
      console.log('Financial Department data updated for date range:', dateRange);
      // Here you would typically refresh financial data based on the date range
    }
  });

  // React to date range changes
  useEffect(() => {
    if (selectedDateRange) {
      console.log('Financial Department: Date range changed', selectedDateRange);
      // Here you would filter/fetch financial data for the selected date range
    }
  }, [selectedDateRange]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectFinancials, setProjectFinancials] = useState<any[]>([]);
  const [benchResources, setBenchResources] = useState<any>({ totalBenchResources: 0, monthlyCost: 0, skillBreakdown: [] });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with real auth token logic
        const token = localStorage.getItem('token') || '';
        const data = await getFinance(token);
        setProjectFinancials(data.departmentProjectFinancials || []);
        setBenchResources(data.departmentBenchResources || { totalBenchResources: 0, monthlyCost: 0, skillBreakdown: [] });
      } catch (err: any) {
        setError(err?.message || 'Failed to load department financial data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const getHealthBadge = (status: string) => (
    <Badge variant={status === "Positive" ? "default" : "destructive"} className="flex items-center gap-1">
      {status === "Positive" ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {status}
    </Badge>
  );

  const totalRevenue = projectFinancials.reduce((sum, p) => sum + p.sowValue, 0);
  const totalActualCost = projectFinancials.reduce((sum, p) => sum + p.actualCostToDate, 0);
  const totalBenchCost = benchResources.monthlyCost;
  const overallMargin = ((totalRevenue - totalActualCost - totalBenchCost) / totalRevenue) * 100;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Department</h1>
        <p className="text-gray-600">Comprehensive financial overview and project cost management for IT services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total SOW Value"
          value={formatCurrency(totalRevenue)}
          trend={{ value: "+18.3% YTD", isPositive: true }}
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <KPICard
          title="Project Actuals"
          value={formatCurrency(totalActualCost)}
          trend={{ value: formatPercentage((totalActualCost/totalRevenue)*100) + " of SOW", isPositive: true }}
          icon={TrendingUp}
          iconColor="text-blue-500"
        />
        <KPICard
          title="Bench Cost (Monthly)"
          value={formatCurrency(totalBenchCost)}
          trend={{ value: "12 resources on bench", isPositive: false }}
          icon={Users}
          iconColor="text-orange-500"
        />
        <KPICard
          title="Overall Margin"
          value={formatPercentage(overallMargin)}
          trend={{ value: overallMargin > 20 ? "Healthy margin" : "Monitor closely", isPositive: overallMargin > 20 }}
          icon={TrendingUp}
          iconColor={overallMargin > 20 ? "text-green-500" : "text-red-500"}
        />
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Project Financials</TabsTrigger>
          <TabsTrigger value="bench">Bench Costing</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Project Financial Health Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Project Details</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">SOW & Billing</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Resource Allocation</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Financial Performance</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Health Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectFinancials.map((project) => (
                      <tr key={project.projectId} className="border-b border-border hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{project.projectName}</div>
                            <div className="text-sm text-gray-500">ID: {project.projectId}</div>
                            <div className="text-sm text-gray-500">Type: {project.projectType}</div>
                            <div className="text-sm text-gray-500">Started: {project.startDate}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">{formatCurrency(project.sowValue)}</div>
                            <div className="text-sm text-gray-500">Rate: {project.billingRate}</div>
                            <div className="text-sm text-gray-500">Monthly Burn: {formatCurrency(project.monthlyBurn)}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="default">{project.billableResources} Billable</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{project.nonBillableResources} Non-Billable</Badge>
                            </div>
                            {project.shadowResources > 0 && (
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{project.shadowResources} Shadow</Badge>
                              </div>
                            )}
                            <div className="text-sm text-gray-500">Utilization: {project.utilizationRate}%</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">Actual: {formatCurrency(project.actualCostToDate)}</div>
                            <div className="text-sm text-gray-500">
                              Margin: <span className={project.profitMargin > 0 ? "text-green-600" : "text-red-600"}>
                                {formatPercentage(project.profitMargin)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">Est. Complete: {project.projectedCompletion}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getHealthBadge(project.healthStatus)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{projectFinancials.length}</div>
                <div className="text-sm text-gray-500">
                  {projectFinancials.filter(p => p.healthStatus === "Positive").length} Healthy • {" "}
                  {projectFinancials.filter(p => p.healthStatus === "Negative").length} At Risk
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {projectFinancials.reduce((sum, p) => sum + p.billableResources + p.nonBillableResources + p.shadowResources, 0)}
                </div>
                <div className="text-sm text-gray-500">
                  {projectFinancials.reduce((sum, p) => sum + p.billableResources, 0)} Billable • {" "}
                  {projectFinancials.reduce((sum, p) => sum + p.nonBillableResources + p.shadowResources, 0)} Non-Billable
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avg Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.round(projectFinancials.reduce((sum, p) => sum + p.utilizationRate, 0) / projectFinancials.length)}%
                </div>
                <div className="text-sm text-gray-500">Across all active projects</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bench" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Bench Resources & Costing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Bench Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{benchResources.totalBenchResources}</div>
                    <div className="text-sm text-gray-600">Total Bench Resources</div>
                    <div className="mt-2">
                      <div className="text-xl font-semibold">{formatCurrency(benchResources.monthlyCost)}</div>
                      <div className="text-sm text-gray-600">Monthly Bench Cost</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Skill-wise Breakdown</h3>
                  <div className="space-y-3">
                    {benchResources.skillBreakdown.map((skill, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{skill.skill}</div>
                          <div className="text-sm text-gray-500">{skill.count} resources</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(skill.monthlyCost)}</div>
                          <div className="text-sm text-gray-500">monthly</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Bench Impact on Profitability</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-yellow-700 font-medium">Annual Bench Cost</div>
                    <div className="text-lg font-bold text-yellow-800">{formatCurrency(benchResources.monthlyCost * 12)}</div>
                  </div>
                  <div>
                    <div className="text-yellow-700 font-medium">Revenue Impact</div>
                    <div className="text-lg font-bold text-yellow-800">-{formatPercentage((benchResources.monthlyCost * 12) / totalRevenue * 100)}</div>
                  </div>
                  <div>
                    <div className="text-yellow-700 font-medium">Target Utilization</div>
                    <div className="text-lg font-bold text-yellow-800">85%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialDepartment;
