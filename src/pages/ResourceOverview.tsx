import { KPICard } from "@/components/dashboard/KPICard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useResourceData } from "@/hooks/useResourceData";

const ResourceOverview = () => {
  // All analytics and KPIs are sourced only from dashboard API
  const {
    loading,
    error,
    bench_aging_data = [],
    monthly_growth_data = [],
    total_resources,
    active_resources,
    non_billable_resources_count,
    non_billable_cost_drain,
    utilization_rate,
    skillData = [],
    seniorityData = [],
    agingData = [],
    engagementData = [],
    upcomingReleases = [],
    internsData = []
  } = useResourceData() || {};

  // Debug: log all received data to help diagnose empty UI
  console.log('ResourceOverview data:', {
    bench_aging_data,
    monthly_growth_data,
    total_resources,
    active_resources,
    non_billable_resources_count,
    non_billable_cost_drain,
    utilization_rate,
    skillData,
    seniorityData,
    agingData,
    engagementData,
    upcomingReleases,
    internsData
  });
  const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

  // Use only real-time backend data for analytics and KPIs
  const benchAging = bench_aging_data;

  // Show a visible error if analytics data is missing or empty
  const isAnalyticsEmpty = (
    (!bench_aging_data || bench_aging_data.length === 0) &&
    (!monthly_growth_data || monthly_growth_data.length === 0) &&
    (typeof total_resources !== 'number' || total_resources === 0) &&
    (typeof active_resources !== 'number' || active_resources === 0) &&
    (typeof non_billable_resources_count !== 'number') &&
    (typeof non_billable_cost_drain !== 'number') &&
    (typeof utilization_rate !== 'number')
  );

  // Show troubleshooting hints if analytics is empty
  const troubleshooting = isAnalyticsEmpty ? (
    <div className="bg-red-50 border border-red-300 rounded p-4 mb-4">
      <div className="font-bold text-red-700 mb-2">No analytics data received from backend.</div>
      <ul className="text-sm text-red-800 list-disc pl-5">
        <li>Check if the backend server is running and accessible at <b>{process.env.VITE_API_BASE || 'http://localhost:5000'}/dashboard</b>.</li>
        <li>Confirm the API base URL in <code>.env</code> is correct (<b>VITE_API_BASE</b>).</li>
        <li>Check browser network tab for failed requests to <code>/dashboard</code>.</li>
        <li>Ensure backend <code>/dashboard</code> route returns analytics fields: <code>total_resources</code>, <code>bench_aging_data</code>, <code>monthly_growth_data</code>, <code>utilization_rate</code>, etc.</li>
        <li>If you see this message, the frontend did not receive usable analytics data. Check backend logs for errors.</li>
      </ul>
    </div>
  ) : null;
  const monthlyGrowth = monthly_growth_data;

  if (loading) return <div className="p-6">Loading resource analytics...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  // Visible debug output for received data
  const debugData = {
    bench_aging_data,
    monthly_growth_data,
    total_resources,
    active_resources,
    non_billable_resources_count,
    non_billable_cost_drain,
    utilization_rate,
    skillData,
    seniorityData,
    agingData,
    engagementData,
    upcomingReleases,
    internsData
  };

  return (
    <div className="space-y-6">
      {/* Show troubleshooting if analytics is empty */}
      {troubleshooting}
      {/* Debug: show received data for troubleshooting */}
      <details className="bg-yellow-50 border border-yellow-300 rounded p-4 mb-4">
        <summary className="font-bold text-yellow-700 cursor-pointer">Debug: Received Data</summary>
        <pre className="text-xs text-yellow-900 overflow-x-auto">{JSON.stringify(debugData, null, 2)}</pre>
      </details>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/resource-management">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resource Management
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Resource Overview & Analytics</h1>
      </div>

      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => window.open("http://localhost:8080/resource-management/total-resources", "_blank")}
        >
          View Full Analytics
        </Button>
      </div>

      {/* Top KPIs - all real-time from backend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Headcount"
          value={typeof total_resources === 'number' && total_resources > 0 ? total_resources : 'No data'}
          trend={undefined}
          icon={Users}
          iconColor="text-blue-500"
        />
        <KPICard
          title="Bench Count"
          value={typeof non_billable_resources_count === 'number' ? non_billable_resources_count : 'No data'}
          subtitle={typeof total_resources === 'number' && typeof non_billable_resources_count === 'number' && total_resources > 0 ? `${((non_billable_resources_count/total_resources)*100).toFixed(1)}% of total` : undefined}
          icon={Users}
          iconColor="text-orange-500"
        />
        <KPICard
          title="Monthly Bench Cost"
          value={typeof non_billable_cost_drain === 'number' ? `$${non_billable_cost_drain.toLocaleString()}` : 'No data'}
          trend={undefined}
          icon={DollarSign}
          iconColor="text-red-500"
        />
        <KPICard
          title="Utilization Rate"
          value={typeof utilization_rate === 'number' ? `${utilization_rate}%` : 'No data'}
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
              <span className="font-semibold text-blue-600">
                {bench_aging_data && bench_aging_data.length > 0
                  ? `${(
                      bench_aging_data.reduce((acc, item) => acc + (item.count * parseInt(item.bucket)), 0) /
                        bench_aging_data.reduce((acc, item) => acc + item.count, 0)
                    ).toFixed(0)} days`
                  : '-'}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {benchAging && benchAging.length > 0 ? benchAging.map((item, index) => (
              <div key={item.bucket} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-sm">{item.bucket}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${item.count}%`, 
                        backgroundColor: COLORS[index % COLORS.length] 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{item.count}</span>
                  <span className="text-sm text-gray-500 w-8">{item.riskLevel}</span>
                </div>
              </div>
            )) : <div>No bench aging data available.</div>}
          </div>
        </div>

        {/* Bench Duration Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bench Duration Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={benchAging}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="count"
              >
                {benchAging && benchAging.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {bench_aging_data && bench_aging_data.map((item, index) => (
              <div key={item.bucket} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-gray-600">{item.bucket}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Bench Cost Trend */}
        <div className="chart-container lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Bench Cost</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']} />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee Summary Table - all real-time from backend */}
      <div className="bg-white rounded-lg shadow-sm border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-gray-900">Team & Resource Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Resource Utilization</h4>
              <div className="text-2xl font-bold text-green-600">{typeof utilization_rate === 'number' ? `${utilization_rate}%` : '-'}</div>
              <p className="text-sm text-gray-600">Overall team utilization</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Average Experience</h4>
              <div className="text-2xl font-bold text-blue-600">{typeof engagementData === 'object' && engagementData.avg_experience ? `${engagementData.avg_experience} years` : '-'}</div>
              <p className="text-sm text-gray-600">Team average experience</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Skills Coverage</h4>
              <div className="text-2xl font-bold text-purple-600">{Array.isArray(skillData) ? skillData.length : '-'}</div>
              <p className="text-sm text-gray-600">Primary technology stacks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceOverview;
