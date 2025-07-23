
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Building, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResourceViewHeaderProps {
  resourceData: {
    fullName: string;
    designation: string;
    location: string;
    department: string;
    experience: string;
    billableStatus: boolean;
  };
}

export const ResourceViewHeader = ({ resourceData }: ResourceViewHeaderProps) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                {getInitials(resourceData.fullName)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{resourceData.fullName}</h1>
                <p className="text-gray-600">{resourceData.designation}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {resourceData.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {resourceData.department}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {resourceData.experience}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={resourceData.billableStatus ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {resourceData.billableStatus ? "Billable" : "Non-Billable"}
              </Badge>
              <span className="text-sm text-gray-500">Active Status</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
