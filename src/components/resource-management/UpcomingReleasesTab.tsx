import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UpcomingReleasesTab = () => {
  const navigate = useNavigate();

  const upcomingReleases = [
    {
      id: "EMP001",
      name: "Alex Rodriguez",
      releaseDate: "2025-08-15",
      currentProject: "Project Alpha",
      utilization: 85,
      skills: ["React.js", "Node.js", "TypeScript", "AWS"],
      status: "confirmed"
    },
    {
      id: "EMP002",
      name: "Emma Thompson", 
      releaseDate: "2025-09-01",
      currentProject: "Project Beta",
      utilization: 90,
      skills: ["Selenium", "Jest", "API Testing", "Automation"],
      status: "tentative"
    }
  ];

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

  const handleViewDetails = (resourceId: string) => {
    navigate(`/resource-view/${resourceId}`);
  };

  const handleEngagementPlan = (resourceId: string) => {
    navigate(`/engagement-plan?resourceId=${resourceId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resources Releasing (Next 2 Months)</h2>
        <Badge variant="outline" className="text-sm">
          {upcomingReleases.length} releases scheduled
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {upcomingReleases.map((resource) => (
          <Card key={resource.id} className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
                    {resource.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{resource.name}</p>
                    <p className="text-sm text-gray-600">{resource.id}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(resource.status)}>
                  {resource.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Release Date</p>
                    <p className="font-medium">{formatDate(resource.releaseDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Utilization</p>
                    <p className="font-medium">{resource.utilization}%</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Current Project</p>
                <p className="font-medium">{resource.currentProject}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {resource.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewDetails(resource.id)}
                >
                  View Details
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 flex items-center gap-1"
                  onClick={() => handleEngagementPlan(resource.id)}
                >
                  <FileText className="h-3 w-3" />
                  Engagement Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
