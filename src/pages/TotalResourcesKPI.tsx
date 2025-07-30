import { useEffect, useState } from "react";
import { getDashboard, DashboardData } from "@/lib/api";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allResourcesData, setAllResourcesData] = useState<any>(null);
  const [allDepartmentData, setAllDepartmentData] = useState<any[]>([]);
  const [allDesignationData, setAllDesignationData] = useState<any[]>([]);
  const [allLocationData, setAllLocationData] = useState<any[]>([]);
  const [monthlyGrowthData, setMonthlyGrowthData] = useState<any[]>([]);

  // Backend-driven breakdown arrays (must be after state is defined)
  // Backend-driven breakdown arrays (must be after state is defined)
  const departmentDataBillable = allDepartmentData.filter((d: any) => d.billable > 0);
  const departmentDataNonBillable = allDepartmentData.filter((d: any) => d.nonBillable > 0);
  const designationDataBillable = allDesignationData.filter((d: any) => d.billable > 0);
  const designationDataNonBillable = allDesignationData.filter((d: any) => d.nonBillable > 0);
  const locationDataBillable = allLocationData.filter((d: any) => d.billable > 0);
  const locationDataNonBillable = allLocationData.filter((d: any) => d.nonBillable > 0);

  let departmentData = allDepartmentData;
  let designationData = allDesignationData;
  let locationData = allLocationData;
  if (selectedFilters.billableStatus === "Billable") {
    departmentData = departmentDataBillable;
    designationData = designationDataBillable;
    locationData = locationDataBillable;
  } else if (selectedFilters.billableStatus === "Non-Billable") {
    departmentData = departmentDataNonBillable;
    designationData = designationDataNonBillable;
    locationData = locationDataNonBillable;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with real auth token logic
        const token = localStorage.getItem('token') || '';
        const data = await getDashboard(token);
        setAllResourcesData({
          total: data.total_resources,
          active: data.active_resources,
          inactive: data.inactive_resources,
          monthlyGrowth: data.monthly_growth,
          billable: data.billable_resources_count,
          nonBillable: data.non_billable_resources_count,
        });
        setAllDepartmentData(data.department_data || []);
        setAllDesignationData(data.designation_data || []);
        setAllLocationData(data.location_data || []);
        setMonthlyGrowthData(data.monthly_growth_data || []);
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

  // Backend-driven breakdown arrays
  // ...existing code...
  if (selectedFilters.billableStatus === "Billable") {
    departmentData = departmentDataBillable;
    designationData = designationDataBillable;
    locationData = locationDataBillable;
  } else if (selectedFilters.billableStatus === "Non-Billable") {
    departmentData = departmentDataNonBillable;
    designationData = designationDataNonBillable;
    locationData = locationDataNonBillable;
  }

  const getSummaryStats = (billableFilter: string) => {
    if (billableFilter === "Billable") {
      return {
        total: allResourcesData?.billable || 0,
        active: allResourcesData?.active || 0,
        inactive: allResourcesData?.inactive || 0,
        monthlyGrowth: allResourcesData?.monthlyGrowth || 0
      };
    }
    if (billableFilter === "Non-Billable") {
      return {
        total: allResourcesData?.nonBillable || 0,
        active: allResourcesData?.active || 0,
        inactive: allResourcesData?.inactive || 0,
        monthlyGrowth: allResourcesData?.monthlyGrowth || 0
      };
    }
    return {
      total: allResourcesData?.total || 0,
      active: allResourcesData?.active || 0,
      inactive: allResourcesData?.inactive || 0,
      monthlyGrowth: allResourcesData?.monthlyGrowth || 0
    };
  };

  const summaryStats = getSummaryStats(selectedFilters.billableStatus);
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
