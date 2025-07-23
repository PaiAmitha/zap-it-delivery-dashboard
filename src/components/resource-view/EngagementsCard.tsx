
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Engagement {
  title: string;
  role: string;
  client: string;
  duration: string;
  status: string;
}

interface EngagementsCardProps {
  engagements: Engagement[];
}

export const EngagementsCard = ({ engagements }: EngagementsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Engagements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {engagements.map((engagement, index) => (
          <div key={index} className="border rounded-lg p-4 bg-red-50 border-red-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{engagement.title}</h4>
              <Badge className="bg-green-100 text-green-800">{engagement.status}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">{engagement.role}</p>
            <p className="text-sm text-gray-500">Client: {engagement.client}</p>
            <p className="text-sm text-gray-500">Duration: {engagement.duration}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
