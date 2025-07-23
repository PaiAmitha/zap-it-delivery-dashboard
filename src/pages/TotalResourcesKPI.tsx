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
  const [selectedFilters, setSelectedFilters] = useState({
    dateRange: "Last 6 months",
    department: "All",
    location: "All",
    billableStatus: "All"
  });

  // Sample data with billable status
  const allResourcesData = {
    total: 142,
    active: 134,
    inactive: 8,
    monthlyGrowth: 2.5,
    billable: 95,
    nonBillable: 47
  };

  const allDepartmentData = [
    { name: "Engineering", count: 68, percentage: 47.9, billable: 45, nonBillable: 23 },
    { name: "QA", count: 24, percentage: 16.9, billable: 18, nonBillable: 6 },
    { name: "DevOps", count: 18, percentage: 12.7, billable: 12, nonBillable: 6 },
    { name: "Data Science", count: 12, percentage: 8.5, billable: 8, nonBillable: 4 },
    { name: "Product", count: 10, percentage: 7.0, billable: 7, nonBillable: 3 },
    { name: "Design", count: 6, percentage: 4.2, billable: 3, nonBillable: 3 },
    { name: "Others", count: 4, percentage: 2.8, billable: 2, nonBillable: 2 }
  ];

  const allDesignationData = [
    { name: "Senior Engineer", count: 35, percentage: 24.6, billable: 28, nonBillable: 7 },
    { name: "Software Engineer", count: 28, percentage: 19.7, billable: 22, nonBillable: 6 },
    { name: "Junior Engineer", count: 22, percentage: 15.5, billable: 15, nonBillable: 7 },
    { name: "QA Engineer", count: 18, percentage: 12.7, billable: 14, nonBillable: 4 },
    { name: "DevOps Engineer", count: 12, percentage: 8.5, billable: 8, nonBillable: 4 },
    { name: "Data Scientist", count: 10, percentage: 7.0, billable: 6, nonBillable: 4 },
    { name: "Others", count: 17, percentage: 12.0, billable: 2, nonBillable: 15 }
  ];

  const allLocationData = [
    { name: "Bangalore", count: 58, percentage: 40.8, billable: 38, nonBillable: 20 },
    { name: "Hyderabad", count: 34, percentage: 23.9, billable: 23, nonBillable: 11 },
    { name: "Mumbai", count: 28, percentage: 19.7, billable: 19, nonBillable: 9 },
    { name: "Chennai", count: 15, percentage: 10.6, billable: 10, nonBillable: 5 },
    { name: "Pune", count: 7, percentage: 4.9, billable: 5, nonBillable: 2 }
  ];

  const getFilteredData = (data: any[], billableFilter: string) => {
    if (billableFilter === "Billable") {
      return data.map(item => ({
        ...item,
        count: item.billable,
        percentage: ((item.billable / allResourcesData.total) * 100).toFixed(1)
      }));
    } else if (billableFilter === "Non-Billable") {
      return data.map(item => ({
        ...item,
        count: item.nonBillable,
        percentage: ((item.nonBillable / allResourcesData.total) * 100).toFixed(1)
      }));
    }
    return data;
  };

  const getSummaryStats = (billableFilter: string) => {
    if (billableFilter === "Billable") {
      return {
        total: allResourcesData.billable,
        active: Math.floor(allResourcesData.billable * 0.94),
        inactive: Math.ceil(allResourcesData.billable * 0.06),
        monthlyGrowth: 3.2
      };
    } else if (billableFilter === "Non-Billable") {
      return {
        total: allResourcesData.nonBillable,
        active: Math.floor(allResourcesData.nonBillable * 0.85),
        inactive: Math.ceil(allResourcesData.nonBillable * 0.15),
        monthlyGrowth: 1.8
      };
    }
    return allResourcesData;
  };

  const departmentData = getFilteredData(allDepartmentData, selectedFilters.billableStatus);
  const designationData = getFilteredData(allDesignationData, selectedFilters.billableStatus);
  const locationData = getFilteredData(allLocationData, selectedFilters.billableStatus);
  const summaryStats = getSummaryStats(selectedFilters.billableStatus);

  const monthlyGrowthData = [
    { month: "Jan", count: 132 },
    { month: "Feb", count: 135 },
    { month: "Mar", count: 138 },
    { month: "Apr", count: 140 },
    { month: "May", count: 141 },
    { month: "Jun", count: 142 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Breadcrumb />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Total Resources Analytics</h1>
            <p className="text-slate-600">Comprehensive overview of organizational resource pool</p>
          </div>
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentData.map((dept) => (
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Designation</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {designationData.map((designation) => (
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TotalResourcesKPI;
