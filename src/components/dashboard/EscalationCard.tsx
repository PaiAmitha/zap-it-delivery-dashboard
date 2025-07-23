
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Escalation {
  id: string;
  title: string;
  customer: string;
  project: string;
  owner: string;
  priority: string;
  status: string;
  dateRaised: string;
  resolutionETA: string;
  description?: string;
}

interface EscalationCardProps {
  escalations: Escalation[];
  onCreateNew: () => void;
}

export const EscalationCard = ({ escalations, onCreateNew }: EscalationCardProps) => {
  const navigate = useNavigate();

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleManageEscalations = () => {
    navigate('/escalations');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Escalations
        </CardTitle>
        <Button size="sm" onClick={handleManageEscalations} className="bg-primary hover:bg-primary/90">
          Manage Escalations
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {escalations.map((escalation) => (
          <Link 
            key={escalation.id}
            to={`/escalations/${escalation.id}`}
            className="block"
          >
            <div className="border border-border rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground text-sm">{escalation.title}</h4>
                <Badge variant="secondary" className={getPriorityBadgeColor(escalation.priority)}>
                  {escalation.priority} Priority
                </Badge>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Customer: {escalation.customer}</span>
                  <span>{escalation.dateRaised}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Project Owner: {escalation.owner}</span>
                  <span>ETA: {escalation.resolutionETA}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
