import { useEffect, useState } from "react";
import { useResourceData } from "@/hooks/useResourceData";
// import { getDashboard, DashboardData } from "@/lib/api";
// Custom hook to fetch KPI counts from backend
const useResourceKPIs = () => {
  const [kpi, setKpi] = useState({ total: 0, billable: 0, nonBillable: 0, intern: 0 });
  useEffect(() => {
    fetch("/api/resources/kpi-counts") // already correct
      .then(res => res.json())
      .then(data => {
        setKpi(data.resourceCounts || { total: 0, billable: 0, nonBillable: 0, intern: 0 });
      });
  }, []);
  return kpi;
};
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
import { Filter, GraduationCap, TrendingUp, Users, Heart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, FunnelChart, Funnel, Cell } from 'recharts';

const InternsKPI = () => {
  // All analytics and KPIs are sourced only from dashboard API
  const {
    loading,
    error,
    internsData = [],
    intern_conversion_funnel = [],
    intern_monthly_conversion = [],
    intern_learning_vs_productive = [],
    intern_location_distribution = [],
    billable_resources_count = 0,
    non_billable_resources_count = 0,
    total_resources = 0,
  } = useResourceData() || {};

  // Helper functions for status and potential colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Assigned": return "bg-green-100 text-green-800";
      case "Unassigned": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interns Analytics</h1>
          <p className="text-gray-600">Intern performance, engagement and conversion tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Billable Resources KPI Card Example */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Billable Resources</p>
                <p className="text-2xl font-bold text-green-600">{billable_resources_count}</p>
              </div>
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ...existing code for Interns KPI cards and analytics... */}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Conversion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Conversion Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {intern_monthly_conversion && intern_monthly_conversion.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={intern_monthly_conversion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversionRate" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">No monthly conversion data available.</div>
            )}
          </CardContent>
        </Card>

        {/* Learning vs Productive Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Learning vs Productive Hours</CardTitle>
          </CardHeader>
          <CardContent>
            {intern_learning_vs_productive && intern_learning_vs_productive.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={intern_learning_vs_productive}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="intern" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="learning" fill="#8884d8" name="Learning Hours" />
                  <Bar dataKey="productive" fill="#82ca9d" name="Productive Hours" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">No learning vs productive data available.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Location Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Location-wise Intern Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {intern_location_distribution && intern_location_distribution.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {intern_location_distribution.map((location) => (
                <div key={location.location} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{location.count}</p>
                  <p className="text-sm text-gray-600">{location.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No intern location distribution data available.</div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Intern List */}
      <Card>
        <CardHeader>
          <CardTitle>Intern Details with Mentor Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          {internsData && internsData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Learning Hrs</TableHead>
                  <TableHead>Productive Hrs</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Conversion Potential</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {internsData.map((intern, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{intern.name}</TableCell>
                    <TableCell>{intern.designation}</TableCell>
                    <TableCell>{intern.project}</TableCell>
                    <TableCell>{intern.mentor}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(intern.status)}>
                        {intern.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{intern.department}</TableCell>
                    <TableCell>{intern.learningHours}</TableCell>
                    <TableCell>{intern.productiveHours}</TableCell>
                    <TableCell className="max-w-xs truncate">{intern.feedback}</TableCell>
                    <TableCell>
                      <Badge className={getPotentialColor(intern.conversionPotential)}>
                        {intern.conversionPotential}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-gray-500 py-8">No intern details data available.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InternsKPI;
