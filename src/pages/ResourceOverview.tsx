
import { KPICard } from "@/components/dashboard/KPICard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ResourceOverview = () => {
  const benchData = [
    { name: '0-30 days', value: 8, percentage: 35 },
    { name: '31-60 days', value: 7, percentage: 30 },
    { name: '61-90 days', value: 5, percentage: 22 },
    { name: '90+ days', value: 3, percentage: 13 },
  ];

  const monthlyBenchCost = [
    { month: 'Jan', cost: 165000 },
    { month: 'Feb', cost: 175000 },
    { month: 'Mar', cost: 185000 },
    { month: 'Apr', cost: 182000 },
    { month: 'May', cost: 190000 },
    { month: 'Jun', cost: 188000 },
  ];

  const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/resource-management">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resource Management
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Resource Overview & Analytics</h1>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Headcount"
          value={142}
          trend={{ value: "+2.5% from last month", isPositive: true }}
          icon={Users}
          iconColor="text-blue-500"
        />
        <KPICard
          title="Bench Count"
          value={23}
          subtitle="16.2% of total"
          icon={Users}
          iconColor="text-orange-500"
        />
        <KPICard
          title="Monthly Bench Cost"
          value="$185,000"
          trend={{ value: "+3.2% from last month", isPositive: false }}
          icon={DollarSign}
          iconColor="text-red-500"
        />
        <KPICard
          title="Training Coverage"
          value="78%"
          icon={TrendingUp}
          iconColor="text-purple-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bench Aging Analysis */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bench Aging Analysis</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Average Bench Duration</span>
              <span className="font-semibold text-blue-600">42 days</span>
            </div>
          </div>
          <div className="space-y-3">
            {benchData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${item.percentage}%`, 
                        backgroundColor: COLORS[index] 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{item.value}</span>
                  <span className="text-sm text-gray-500 w-8">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bench Duration Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bench Duration Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={benchData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {benchData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {benchData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Bench Cost Trend */}
        <div className="chart-container lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Bench Cost</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyBenchCost}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
              <Bar dataKey="cost" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee Summary Table */}
      <div className="bg-white rounded-lg shadow-sm border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-gray-900">Team & Resource Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Resource Utilization</h4>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-sm text-gray-600">Overall team utilization</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Average Experience</h4>
              <div className="text-2xl font-bold text-blue-600">4.2 years</div>
              <p className="text-sm text-gray-600">Team average experience</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Skills Coverage</h4>
              <div className="text-2xl font-bold text-purple-600">12</div>
              <p className="text-sm text-gray-600">Primary technology stacks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceOverview;
