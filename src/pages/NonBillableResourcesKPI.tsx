import { useResourceData } from "@/hooks/useResourceData";
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
  // All analytics and KPIs are sourced only from dashboard API
  const {
    loading,
    error,
    non_billable_resources_count,
    non_billable_cost_drain,
    avg_bench_days,
    reallocation_opportunities,
    bench_reason_data = [],
    bench_aging_data = [],
    weekly_movement_data = [],
    non_billable_location_distribution = [],
    non_billable_resources_list = [],
  } = useResourceData() || {};

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

      {/* Summary Cards from dashboard API */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non-Billable Resources</p>
                <p className="text-3xl font-bold text-orange-600">{typeof non_billable_resources_count === 'number' ? non_billable_resources_count : '-'}</p>
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
                <p className="text-3xl font-bold text-red-600">{typeof non_billable_cost_drain === 'number' ? `$${(non_billable_cost_drain / 1000).toFixed(0)}K` : '-'}</p>
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
                <p className="text-3xl font-bold text-yellow-600">{typeof avg_bench_days === 'number' ? avg_bench_days : '-'}</p>
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
                <p className="text-3xl font-bold text-green-600">{typeof reallocation_opportunities === 'number' ? reallocation_opportunities : '-'}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section from dashboard API */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bench Reasons */}
        <Card>
          <CardHeader>
            <CardTitle>Non-Billable Reasons Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {bench_reason_data && bench_reason_data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bench_reason_data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ reason, count }) => `${reason}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {bench_reason_data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">No bench reason data available.</div>
            )}
          </CardContent>
        </Card>

        {/* Bench Aging */}
        <Card>
          <CardHeader>
            <CardTitle>Bench Aging Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {bench_aging_data && bench_aging_data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bench_aging_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bucket" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">No bench aging data available.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Movement Report from dashboard API */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Bench Movement Report</CardTitle>
        </CardHeader>
        <CardContent>
          {weekly_movement_data && weekly_movement_data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weekly_movement_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="moved" stroke="#8884d8" strokeWidth={2} name="Moved to Billing" />
                <Line type="monotone" dataKey="added" stroke="#82ca9d" strokeWidth={2} name="Added to Bench" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-8">No weekly movement data available.</div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Tables from dashboard API */}
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
            {bench_aging_data && bench_aging_data.length > 0 ? (
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
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
                    {bench_aging_data.map((item) => (
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
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">No bench aging breakdown data available.</div>
            )}
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Location-wise Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {non_billable_location_distribution && non_billable_location_distribution.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Monthly Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {non_billable_location_distribution.map((location) => (
                    <TableRow key={location.location}>
                      <TableCell className="font-medium">{location.location}</TableCell>
                      <TableCell>{location.count}</TableCell>
                      <TableCell>${(location.cost / 1000).toFixed(0)}K</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-gray-500 py-8">No location distribution data available.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Individual Resources with Reallocation Suggestions from dashboard API */}
      <Card>
        <CardHeader>
          <CardTitle>Non-Billable Resources with Reallocation Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {non_billable_resources_list && non_billable_resources_list.length > 0 ? (
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
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
                  {non_billable_resources_list.map((resource, index) => (
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
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No non-billable resources data available.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NonBillableResourcesKPI;
