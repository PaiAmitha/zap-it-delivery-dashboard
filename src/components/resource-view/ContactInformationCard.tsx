
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User, Calendar } from "lucide-react";

interface ContactInformationCardProps {
  resourceData: {
    email: string;
    phone: string;
    employeeId: string;
    joinedDate: string;
  };
}

export const ContactInformationCard = ({ resourceData }: ContactInformationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>{resourceData.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-gray-500" />
          <span>{resourceData.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-gray-500" />
          <span>Employee ID: {resourceData.employeeId}</span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>Joined: {resourceData.joinedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};
