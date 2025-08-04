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
import { Filter, DollarSign, TrendingUp, Users, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';


const BillableResourcesKPI = () => {
  // All analytics and KPIs are sourced only from dashboard API
  const {
    loading,
    error,
    billable_resources = [],
    billable_resources_count,
    utilization_trend = [],
    client_allocation = [],
    productivity_trend = [],
    total_resources,
    non_billable_resources_count,
    internsData = [],
  } = useResourceData() || {};
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

      {/* Billable Resources KPI Card from dashboard API */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Billable Resources</p>
                <p className="text-2xl font-bold text-green-600">{typeof billable_resources_count === 'number' ? billable_resources_count : '-'}</p>
              </div>
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Charts Section - now using dashboard analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Utilization Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {utilization_trend && utilization_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={utilization_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="utilization" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">No utilization trend data available.</div>
            )}
          </CardContent>
        </Card>

        {/* Client Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Client-wise Resource Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            {client_allocation && client_allocation.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={client_allocation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="client" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="resources" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">No client allocation data available.</div>
            )}
          </CardContent>
        </Card>
      </div>


      {/* Productivity vs Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Productivity vs Allocation Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {productivity_trend && productivity_trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productivity_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="productivity" stroke="#8884d8" strokeWidth={2} name="Productivity" />
                <Line type="monotone" dataKey="allocation" stroke="#82ca9d" strokeWidth={2} name="Allocation" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-8">No productivity trend data available.</div>
          )}
        </CardContent>
      </Card>

      {/* Billable Resources List from dashboard API */}
      <Card>
        <CardHeader>
          <CardTitle>Billable Resources Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ maxHeight: '350px', overflowY: 'auto', overflowX: 'auto' }} className="rounded-lg border border-gray-100">
            {billable_resources && billable_resources.length > 0 ? (
              <Table className="min-w-[700px]">
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
                  {billable_resources.map((resource, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{resource.full_name || resource.name}</TableCell>
                      <TableCell>{resource.designation}</TableCell>
                      <TableCell>{resource.client || resource.project_name}</TableCell>
                      <TableCell>
                        <Badge variant={resource.utilization_rate >= 90 ? "default" : resource.utilization_rate >= 80 ? "secondary" : "destructive"}>
                          {resource.utilization_rate}%
                        </Badge>
                      </TableCell>
                      <TableCell>${resource.billing_rate || resource.monthly_cost}/hr</TableCell>
                      <TableCell>
                        <Badge variant={resource.productivity >= 95 ? "default" : resource.productivity >= 90 ? "secondary" : "outline"}>
                          {resource.productivity || "-"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-gray-500 py-8">No billable resources data available.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillableResourcesKPI;
