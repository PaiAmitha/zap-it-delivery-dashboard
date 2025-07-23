import { useState } from "react";
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
  const summaryStats = {
    billableCount: 89,
    utilizationRate: 85.2,
    avgBillingRate: 75,
    monthlyRevenue: 1200000,
    productivityScore: 92
  };

  const utilizationData = [
    { week: "Week 1", utilization: 82 },
    { week: "Week 2", utilization: 85 },
    { week: "Week 3", utilization: 88 },
    { week: "Week 4", utilization: 85 },
    { week: "Week 5", utilization: 87 },
    { week: "Week 6", utilization: 90 }
  ];

  const clientAllocationData = [
    { client: "TechCorp", resources: 25, revenue: 450000 },
    { client: "InnovateLabs", resources: 18, revenue: 320000 },
    { client: "DataSys", resources: 15, revenue: 275000 },
    { client: "CloudFlow", resources: 12, revenue: 195000 },
    { client: "Others", resources: 19, revenue: 260000 }
  ];

  const productivityData = [
    { month: "Jan", productivity: 88, allocation: 85 },
    { month: "Feb", productivity: 90, allocation: 87 },
    { month: "Mar", productivity: 89, allocation: 89 },
    { month: "Apr", productivity: 92, allocation: 88 },
    { month: "May", productivity: 91, allocation: 86 },
    { month: "Jun", productivity: 94, allocation: 90 }
  ];

  const billableResourcesList = [
    { name: "John Smith", designation: "Senior Engineer", client: "TechCorp", utilization: 95, billingRate: 85, productivity: 98 },
    { name: "Sarah Johnson", designation: "Full Stack Developer", client: "InnovateLabs", utilization: 88, billingRate: 75, productivity: 92 },
    { name: "Mike Chen", designation: "DevOps Engineer", client: "DataSys", utilization: 92, billingRate: 80, productivity: 95 },
    { name: "Emily Davis", designation: "QA Engineer", client: "CloudFlow", utilization: 85, billingRate: 65, productivity: 89 },
    { name: "Alex Wilson", designation: "Data Scientist", client: "TechCorp", utilization: 90, billingRate: 90, productivity: 94 }
  ];

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
