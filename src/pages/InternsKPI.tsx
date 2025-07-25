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
import { Filter, GraduationCap, TrendingUp, Users, Heart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, FunnelChart, Funnel, Cell } from 'recharts';

const InternsKPI = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryStats, setSummaryStats] = useState<any>(null);
  const [conversionFunnelData, setConversionFunnelData] = useState<any[]>([]);
  const [monthlyConversionData, setMonthlyConversionData] = useState<any[]>([]);
  const [learningVsProductiveData, setLearningVsProductiveData] = useState<any[]>([]);
  const [locationDistribution, setLocationDistribution] = useState<any[]>([]);
  const [internDetailsList, setInternDetailsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with real auth token logic
        const token = localStorage.getItem('token') || '';
        const data = await getDashboard(token);
        setSummaryStats({
          totalInterns: data.total_interns,
          assigned: data.interns_assigned,
          unassigned: data.interns_unassigned,
          conversionRate: data.intern_conversion_rate,
          avgLearningHours: data.avg_learning_hours,
          avgProductiveHours: data.avg_productive_hours,
        });
        setConversionFunnelData(data.intern_conversion_funnel || []);
        setMonthlyConversionData(data.intern_monthly_conversion || []);
        setLearningVsProductiveData(data.intern_learning_vs_productive || []);
        setLocationDistribution(data.intern_location_distribution || []);
        setInternDetailsList(data.intern_details_list || []);
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Interns</p>
                <p className="text-2xl font-bold text-purple-600">{summaryStats.totalInterns}</p>
              </div>
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-green-600">{summaryStats.assigned}</p>
              </div>
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-yellow-600">{summaryStats.unassigned}</p>
              </div>
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-blue-600">{summaryStats.conversionRate}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Learning Hrs</p>
                <p className="text-2xl font-bold text-indigo-600">{summaryStats.avgLearningHours}</p>
              </div>
              <Heart className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Productive Hrs</p>
                <p className="text-2xl font-bold text-orange-600">{summaryStats.avgProductiveHours}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Conversion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Conversion Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyConversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="conversionRate" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Learning vs Productive Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Learning vs Productive Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={learningVsProductiveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="intern" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="learning" fill="#8884d8" name="Learning Hours" />
                <Bar dataKey="productive" fill="#82ca9d" name="Productive Hours" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Location Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Location-wise Intern Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {locationDistribution.map((location) => (
              <div key={location.location} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{location.count}</p>
                <p className="text-sm text-gray-600">{location.location}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Intern List */}
      <Card>
        <CardHeader>
          <CardTitle>Intern Details with Mentor Mapping</CardTitle>
        </CardHeader>
        <CardContent>
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
              {internDetailsList.map((intern, index) => (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default InternsKPI;
