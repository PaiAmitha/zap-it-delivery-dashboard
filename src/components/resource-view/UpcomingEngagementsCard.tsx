
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User, Building } from "lucide-react";

interface UpcomingEngagement {
  title: string;
  role: string;
  client: string;
  duration: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface UpcomingEngagementsCardProps {
  engagements: UpcomingEngagement[];
}

export const UpcomingEngagementsCard = ({ engagements }: UpcomingEngagementsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Engagements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {engagements.map((engagement, index) => (
          <div key={index} className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">{engagement.title}</h4>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                {engagement.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{engagement.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{engagement.client}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {engagement.startDate} - {engagement.endDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Duration: {engagement.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
