import { useResourceData } from "@/hooks/useResourceData";
import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { EnhancedKPICard } from "@/components/dashboard/EnhancedKPICard";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Users, UserCheck, UserX, Building, MapPin, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';



const TotalResourcesKPI = () => {
  // Use dashboard API for all analytics and KPIs
  const {
    loading,
    error,
    total_resources = 0,
    active_resources = 0,
    inactive_resources = 0,
    monthly_growth_data = [],
    departmentData = [],
    designationData = [],
    locationData = [],
  } = useResourceData() || {};

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  // Filtering logic (stub, can be expanded)
  const [selectedFilters, setSelectedFilters] = useState({ billableStatus: "All" });
  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Summary stats
  const summaryStats = {
    total: total_resources,
    active: active_resources,
    inactive: inactive_resources,
    monthlyGrowth: monthly_growth_data.length > 0 ? monthly_growth_data[monthly_growth_data.length-1].count : 0
  };

  // Defensive fallback for percentage calculation
  const monthlyGrowthData = monthly_growth_data || [];
  const totalDept = departmentData.reduce((sum, d) => sum + (d.count || 0), 0);
  const departmentTableData = departmentData.map(d => ({
    ...d,
    percentage: d.percentage !== undefined ? d.percentage : totalDept ? Math.round((d.count / totalDept) * 100) : 0
  }));

  const totalDesig = designationData.reduce((sum, d) => sum + (d.count || 0), 0);
  const designationTableData = designationData.map(d => ({
    ...d,
    percentage: d.percentage !== undefined ? d.percentage : totalDesig ? Math.round((d.count / totalDesig) * 100) : 0
  }));

  if (loading) return <div className="p-6">Loading resource analytics...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Breadcrumb />
        <p className="text-slate-600">Comprehensive overview of organizational resource pool</p>
        <div className="flex gap-2">
          <Select 
            value={selectedFilters.billableStatus} 
            onValueChange={(value) => handleFilterChange('billableStatus', value)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Resources</SelectItem>
              <SelectItem value="Billable">Billable</SelectItem>
              <SelectItem value="Non-Billable">Non-Billable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <EnhancedKPICard
            title={selectedFilters.billableStatus === "All" ? "Total Resources" : 
                   selectedFilters.billableStatus === "Billable" ? "Billable Resources" : 
                   "Non-Billable Resources"}
            value={summaryStats.total}
            subtitle="Active across all projects"
            icon={Users}
            bgColor="bg-blue-50"
            iconBgColor="bg-blue-500"
            textColor="text-blue-700"
          />
          <EnhancedKPICard
            title="Active Resources"
            value={summaryStats.active}
            subtitle="Currently engaged"
            icon={UserCheck}
            bgColor="bg-emerald-50"
            iconBgColor="bg-emerald-500"
            textColor="text-emerald-700"
          />
          <EnhancedKPICard
            title="Inactive Resources"
            value={summaryStats.inactive}
            subtitle="Not currently engaged"
            icon={UserX}
            bgColor="bg-red-50"
            iconBgColor="bg-red-500"
            textColor="text-red-700"
          />
          <EnhancedKPICard
            title="Monthly Growth"
            value={`+${summaryStats.monthlyGrowth}%`}
            subtitle="Resource expansion"
            icon={Calendar}
            bgColor="bg-purple-50"
            iconBgColor="bg-purple-500"
            textColor="text-purple-700"
            trend={{ value: `+${summaryStats.monthlyGrowth}%`, isPositive: true }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Department-wise Distribution
                {selectedFilters.billableStatus !== "All" && (
                  <Badge variant="outline" className="ml-2">
                    {selectedFilters.billableStatus}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
          <CardContent>
            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">No department distribution data available.</div>
            )}
          </CardContent>
          </Card>

          {/* Location Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location-wise Distribution
                {selectedFilters.billableStatus !== "All" && (
                  <Badge variant="outline" className="ml-2">
                    {selectedFilters.billableStatus}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
          <CardContent>
            {locationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">No location distribution data available.</div>
            )}
          </CardContent>
          </Card>
        </div>

        {/* Monthly Growth Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Resource Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">No monthly growth trend data available.</div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Department Breakdown
                {selectedFilters.billableStatus !== "All" && (
                  <Badge variant="outline" className="ml-2">
                    {selectedFilters.billableStatus}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {departmentTableData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentTableData.map((dept) => (
                      <TableRow key={dept.name}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.count}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{dept.percentage}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-500 py-8">No department breakdown data available.</div>
              )}
            </CardContent>
          </Card>

          {/* Designation Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Designation Breakdown
                {selectedFilters.billableStatus !== "All" && (
                  <Badge variant="outline" className="ml-2">
                    {selectedFilters.billableStatus}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {designationTableData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Designation</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {designationTableData.map((designation) => (
                      <TableRow key={designation.name}>
                        <TableCell className="font-medium">{designation.name}</TableCell>
                        <TableCell>{designation.count}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{designation.percentage}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-500 py-8">No designation breakdown data available.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TotalResourcesKPI;
