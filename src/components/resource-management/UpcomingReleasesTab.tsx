import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getEmployees } from "@/lib/api";

export const UpcomingReleasesTab = () => {
  const [upcomingReleases, setUpcomingReleases] = useState<any[]>([]);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const employees = await getEmployees(token);
        // Filter employees with a releaseDate property
        const releases = Array.isArray(employees)
          ? employees.filter(e => e.releaseDate)
          : [];
        setUpcomingReleases(releases);
      } catch (err) {
        setUpcomingReleases([]);
      }
    };
    fetchReleases();
  }, []);

// ...existing code...

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Releases</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingReleases.length === 0 ? (
            <div className="text-gray-500">No upcoming releases found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingReleases.map((release) => (
                <Card key={release.id || release.employeeId} className="border border-gray-200 shadow-sm">
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
// ...existing code...
// ...existing code...

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
          {upcomingReleases.length === 0 ? (
            <div className="text-gray-500">No upcoming releases found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingReleases.map((release) => (
                <Card key={release.id || release.employeeId} className="border border-gray-200 shadow-sm">
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
