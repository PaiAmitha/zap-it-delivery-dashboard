import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getUpcomingReleases } from "@/lib/api";

export const UpcomingReleasesTab = () => {
  const [upcomingReleases, setUpcomingReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const result = await getUpcomingReleases(token);
        setUpcomingReleases((result as any).upcomingReleases || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch upcoming releases');
        setUpcomingReleases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  const getStatusColor = (status: string) => {
    return status === "confirmed"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Releases</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-500">Loading upcoming releases...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : upcomingReleases.length === 0 ? (
            <div className="text-gray-500">No upcoming releases found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingReleases.map((release) => (
                <Card key={release.id || release.resourceId} className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-blue-900">{formatDate(release.releaseDate)}</span>
                      <Badge className={getStatusColor(release.status)}>{release.status}</Badge>
                    </div>
                    <div className="font-bold text-lg text-gray-900">{release.name || release.fullName}</div>
                    <div className="text-sm text-gray-600 mb-2">Current Project: {release.currentProject || release.projectName}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(release.skills || release.primarySkills || []).map((skill: string, idx: number) => (
                        <Badge key={idx} className="bg-gray-100 text-gray-800">{skill}</Badge>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">Utilization: {release.utilization || release.utilization_rate || 0}%</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
