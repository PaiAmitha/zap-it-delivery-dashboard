
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface Release {
  id: string;
  name: string;
  releaseDate: string;
  currentProject: string;
  utilization: number;
  status: 'confirmed' | 'tentative';
  skills: string[];
}

interface UpcomingReleasesProps {
  releases: Release[];
  onViewDetails: (release: Release) => void;
  onAllocateToProject: (release: Release) => void;
}

export const UpcomingReleases = ({ 
  releases, 
  onViewDetails, 
  onAllocateToProject 
}: UpcomingReleasesProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">confirmed</Badge>;
      case 'tentative':
        return <Badge className="bg-yellow-100 text-yellow-800">tentative</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <CardTitle>Resource Releases (Next 2 Months)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {releases.map((release) => (
            <Card key={release.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <span className="text-blue-600 font-semibold text-sm">
                        {release.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{release.name}</h4>
                        {getStatusBadge(release.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Release Date: {release.releaseDate}</span>
                        <span>Current Project: {release.currentProject}</span>
                        <span>Utilization: {release.utilization}%</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-500">Skills:</span>
                        <div className="flex gap-1">
                          {release.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewDetails(release)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => onAllocateToProject(release)}
                    >
                      Allocate to Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
