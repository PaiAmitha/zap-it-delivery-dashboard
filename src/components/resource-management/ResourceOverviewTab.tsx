
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceAnalyticsDashboard } from "@/components/resource-management/ResourceAnalyticsDashboard";

export const ResourceOverviewTab = () => {
  // Sample data for the analytics dashboard
  const seniorityData = [
    { level: "Senior (6+ yrs)", count: 45, percentage: 32, monthlyCost: 540000, ytdCost: 3240000 },
    { level: "Mid-Senior (3-6 yrs)", count: 38, percentage: 27, monthlyCost: 456000, ytdCost: 2736000 },
    { level: "Junior (1-3 yrs)", count: 59, percentage: 42, monthlyCost: 354000, ytdCost: 2124000 }
  ];

  const skillData = [
    { category: "Frontend Development", count: 25, monthlyCost: 300000 },
    { category: "Backend Development", count: 30, monthlyCost: 360000 },
    { category: "Full Stack Development", count: 20, monthlyCost: 280000 },
    { category: "DevOps", count: 15, monthlyCost: 225000 },
    { category: "QA Testing", count: 18, monthlyCost: 216000 },
    { category: "Data Science", count: 12, monthlyCost: 180000 }
  ];

  const agingData = [
    { bucket: "<30 days", count: 12, monthlyCost: 144000, avgDailyCost: 4800, riskLevel: "low" as const },
    { bucket: "30-60 days", count: 8, monthlyCost: 96000, avgDailyCost: 4000, riskLevel: "medium" as const },
    { bucket: "60-90 days", count: 7, monthlyCost: 84000, avgDailyCost: 4000, riskLevel: "high" as const },
    { bucket: ">90 days", count: 7, monthlyCost: 84000, avgDailyCost: 4000, riskLevel: "high" as const }
  ];

  const engagementData = [
    { type: "Training", count: 8, monthlyCost: 96000, startDate: "2025-05-15", endDate: "2025-08-30", notes: "Technical skills enhancement program" },
    { type: "Shadow Project", count: 5, monthlyCost: 60000, startDate: "2025-06-01", endDate: "2025-07-31", notes: "Learning project for junior resources" },
    { type: "Internal Project", count: 6, monthlyCost: 72000, startDate: "2025-05-01", endDate: "2025-09-30", notes: "Internal tool development" },
    { type: "Pre-Sales", count: 3, monthlyCost: 36000, startDate: "2025-06-10", endDate: "2025-08-10", notes: "Client presentation and demos" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceAnalyticsDashboard
            seniorityData={seniorityData}
            skillData={skillData}
            agingData={agingData}
            engagementData={engagementData}
            onViewDetails={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};
