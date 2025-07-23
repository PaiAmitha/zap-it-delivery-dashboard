
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Clock, User } from "lucide-react";

interface ReleaseResource {
  id: string;
  name: string;
  currentProject: string;
  releaseDate: string;
  role: string;
  experience: string;
  skillset: string[];
  utilizationPercentage: number;
  status: "confirmed" | "tentative" | "at-risk";
}

interface ResourceReleaseSectionProps {
  resources: ReleaseResource[];
}

export const ResourceReleaseSection = ({ resources }: ResourceReleaseSectionProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "tentative": return "bg-yellow-100 text-yellow-800";
      case "at-risk": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="truncate">Resource Releases (Next 2 Months)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-4">
          {resources.length === 0 ? (
            <p className="text-muted-foreground text-center py-4 text-sm sm:text-base">No resources scheduled for release in the next 2 months.</p>
          ) : (
            resources.map((resource) => (
              <div key={resource.id} className="border rounded-lg p-3 sm:p-4 space-y-3 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">
                      {resource.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm sm:text-base truncate">{resource.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{resource.role} • {resource.experience}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(resource.status)} text-xs flex-shrink-0`}>
                    {resource.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs">Release Date</p>
                      <p className="font-medium truncate">{formatDate(resource.releaseDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs">Current Project</p>
                      <p className="font-medium truncate">{resource.currentProject}</p>
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-muted-foreground text-xs">Utilization</p>
                    <p className="font-medium">{resource.utilizationPercentage}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.skillset.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Link to={`/resource-details/${resource.id}`} className="flex-1 sm:flex-none">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/project-allocation?resourceId=${resource.id}`} className="flex-1 sm:flex-none">
                    <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                      Allocate to Project
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
