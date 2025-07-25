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
import { Filter, AlertTriangle, TrendingDown, DollarSign, Users, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const NonBillableResourcesKPI = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryStats, setSummaryStats] = useState<any>(null);
  const [benchReasonData, setBenchReasonData] = useState<any[]>([]);
  const [benchAgingData, setBenchAgingData] = useState<any[]>([]);
  const [weeklyMovementData, setWeeklyMovementData] = useState<any[]>([]);
  const [locationDistribution, setLocationDistribution] = useState<any[]>([]);
  const [nonBillableResourcesList, setNonBillableResourcesList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with real auth token logic
        const token = localStorage.getItem('token') || '';
        const data = await getDashboard(token);
        setSummaryStats({
          nonBillableCount: data.non_billable_resources_count,
          costDrain: data.non_billable_cost_drain,
          avgBenchDays: data.avg_bench_days,
          reallocationOpportunities: data.reallocation_opportunities,
        });
        setBenchReasonData(data.bench_reason_data || []);
        setBenchAgingData(data.bench_aging_data || []);
        setWeeklyMovementData(data.weekly_movement_data || []);
        setLocationDistribution(data.non_billable_location_distribution || []);
        setNonBillableResourcesList(data.non_billable_resources_list || []);
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

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Non-Billable Resources Analytics</h1>
          <p className="text-gray-600">Bench management and reallocation opportunities</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non-Billable Resources</p>
                <p className="text-3xl font-bold text-orange-600">{summaryStats.nonBillableCount}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Cost Drain</p>
                <p className="text-3xl font-bold text-red-600">${(summaryStats.costDrain / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Bench Days</p>
                <p className="text-3xl font-bold text-yellow-600">{summaryStats.avgBenchDays}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reallocation Ready</p>
                <p className="text-3xl font-bold text-green-600">{summaryStats.reallocationOpportunities}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bench Reasons */}
        <Card>
          <CardHeader>
            <CardTitle>Non-Billable Reasons Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={benchReasonData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ reason, count }) => `${reason}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {benchReasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bench Aging */}
        <Card>
          <CardHeader>
            <CardTitle>Bench Aging Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={benchAgingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bucket" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Movement Report */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Bench Movement Report</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyMovementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="moved" stroke="#8884d8" strokeWidth={2} name="Moved to Billing" />
              <Line type="monotone" dataKey="added" stroke="#82ca9d" strokeWidth={2} name="Added to Bench" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bench Aging Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Bench Aging Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aging Bucket</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {benchAgingData.map((item) => (
                  <TableRow key={item.bucket}>
                    <TableCell className="font-medium">{item.bucket}</TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>${(item.cost / 1000).toFixed(0)}K</TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(item.riskLevel)}>
                        {item.riskLevel.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Location-wise Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Monthly Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locationDistribution.map((location) => (
                  <TableRow key={location.location}>
                    <TableCell className="font-medium">{location.location}</TableCell>
                    <TableCell>{location.count}</TableCell>
                    <TableCell>${(location.cost / 1000).toFixed(0)}K</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Individual Resources with Reallocation Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Non-Billable Resources with Reallocation Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Bench Days</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Suggestion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nonBillableResourcesList.map((resource, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.designation}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{resource.reason}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={resource.benchDays > 60 ? "destructive" : resource.benchDays > 30 ? "secondary" : "default"}>
                      {resource.benchDays} days
                    </Badge>
                  </TableCell>
                  <TableCell>{resource.location}</TableCell>
                  <TableCell>${resource.monthlyCost}</TableCell>
                  <TableCell className="text-green-600 font-medium">{resource.suggestion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default NonBillableResourcesKPI;
