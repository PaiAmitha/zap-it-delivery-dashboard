import { useEffect, useState } from "react";
import { getDashboard, DashboardData } from "@/lib/api";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Filter, DollarSign, TrendingUp, Users, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

const BillableResourcesKPI = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryStats, setSummaryStats] = useState<{
    billableCount: number;
    utilizationRate: number;
    avgBillingRate: number;
    monthlyRevenue: number;
    productivityScore: number;
  } | null>(null);
  const [utilizationData, setUtilizationData] = useState<DashboardData["utilization_trend"]>([]);
  const [clientAllocationData, setClientAllocationData] = useState<DashboardData["client_allocation"]>([]);
  const [productivityData, setProductivityData] = useState<DashboardData["productivity_trend"]>([]);
  const [billableResourcesList, setBillableResourcesList] = useState<DashboardData["billable_resources"]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with real auth token logic
        const token = localStorage.getItem('token') || '';
        const data = await getDashboard(token);
        // Map backend data to frontend fields as needed
        setSummaryStats({
          billableCount: data.billable_count,
          utilizationRate: data.utilization_rate,
          avgBillingRate: data.avg_billing_rate,
          monthlyRevenue: data.monthly_revenue,
          productivityScore: data.productivity_score,
        });
        setUtilizationData(data.utilization_trend || []);
        setClientAllocationData(data.client_allocation || []);
        setProductivityData(data.productivity_trend || []);
        setBillableResourcesList(data.billable_resources || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <Breadcrumb />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billable Resources Analytics</h1>
          <p className="text-gray-600">Revenue-contributing employees performance and utilization</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Billable Resources</p>
                <p className="text-2xl font-bold text-green-600">{summaryStats.billableCount}</p>
              </div>
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilization Rate</p>
                <p className="text-2xl font-bold text-blue-600">{summaryStats.utilizationRate}%</p>
              </div>
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Billing Rate</p>
                <p className="text-2xl font-bold text-purple-600">${summaryStats.avgBillingRate}/hr</p>
              </div>
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-orange-600">${(summaryStats.monthlyRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Productivity Score</p>
                <p className="text-2xl font-bold text-indigo-600">{summaryStats.productivityScore}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Utilization Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="utilization" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Client Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Client-wise Resource Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientAllocationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="client" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="resources" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Productivity vs Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Productivity vs Allocation Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="productivity" stroke="#8884d8" strokeWidth={2} name="Productivity" />
              <Line type="monotone" dataKey="allocation" stroke="#82ca9d" strokeWidth={2} name="Allocation" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Billable Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>Billable Resources Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Billing Rate</TableHead>
                <TableHead>Productivity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billableResourcesList.map((resource, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.designation}</TableCell>
                  <TableCell>{resource.client}</TableCell>
                  <TableCell>
                    <Badge variant={resource.utilization >= 90 ? "default" : resource.utilization >= 80 ? "secondary" : "destructive"}>
                      {resource.utilization}%
                    </Badge>
                  </TableCell>
                  <TableCell>${resource.billingRate}/hr</TableCell>
                  <TableCell>
                    <Badge variant={resource.productivity >= 95 ? "default" : resource.productivity >= 90 ? "secondary" : "outline"}>
                      {resource.productivity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillableResourcesKPI;
