

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceAnalyticsDashboard } from "@/components/resource-management/ResourceAnalyticsDashboard";

export const ResourceOverviewTab = () => {
  const [seniorityData, setSeniorityData] = useState<any[]>([]);
  const [skillData, setSkillData] = useState<any[]>([]);
  const [agingData, setAgingData] = useState<any[]>([]);
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/resources/analytics/seniority`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`/resources/analytics/skills`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`/resources/analytics/aging`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`/resources/analytics/engagement`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([sen, skill, aging, engagement]) => {
      setSeniorityData(sen.seniorityData || []);
      setSkillData(skill.skillData || []);
      setAgingData(aging.agingData || []);
      setEngagementData(engagement.engagementData || []);
    }).catch((err) => {
      setError(err?.message || 'Failed to fetch analytics');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading analytics...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ResourceAnalyticsDashboard
              seniorityData={seniorityData}
              skillData={skillData}
              agingData={agingData}
              engagementData={engagementData}
              onViewDetails={() => {}}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
