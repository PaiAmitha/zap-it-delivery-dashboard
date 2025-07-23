
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Calendar, DollarSign, Award, MapPin, Clock, Building } from "lucide-react";

interface ResourceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: any;
  type: 'seniority' | 'skill' | 'aging' | 'engagement' | 'intern';
}

export const ResourceDetailsModal = ({ isOpen, onClose, resource, type }: ResourceDetailsModalProps) => {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  // Early return if resource is null
  if (!resource) {
    return null;
  }

  const renderInternDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{resource.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{resource.name.toLowerCase().replace(' ', '.')}@company.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{resource.department}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Program Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{resource.startDate} - {resource.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formatCurrency(resource.stipend)}/month</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Mentor: {resource.mentor}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Project Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="font-medium">{resource.assignedProject}</span>
            <Badge variant={resource.status === 'Active' ? 'default' : 'secondary'}>
              {resource.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{resource.education}</p>
          <div className="mt-4">
            <span className="text-sm font-medium">Conversion Potential: </span>
            <Badge variant={resource.conversionPotential === 'High' ? 'default' : 'secondary'}>
              {resource.conversionPotential}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResourceDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Count</span>
          <p className="text-lg font-semibold">{resource.count}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Monthly Cost</span>
          <p className="text-lg font-semibold">{formatCurrency(resource.monthlyCost)}</p>
        </div>
      </div>
      
      {type === 'seniority' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Percentage</span>
            <p className="text-lg font-semibold">{resource.percentage}%</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">YTD Cost</span>
            <p className="text-lg font-semibold">{formatCurrency(resource.ytdCost)}</p>
          </div>
        </div>
      )}

      {type === 'aging' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Avg Daily Cost</span>
            <p className="text-lg font-semibold">{formatCurrency(resource.avgDailyCost)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
            <Badge variant={resource.riskLevel === 'high' ? 'destructive' : resource.riskLevel === 'medium' ? 'secondary' : 'default'}>
              {resource.riskLevel.toUpperCase()}
            </Badge>
          </div>
        </div>
      )}

      {type === 'engagement' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Start Date</span>
              <p className="text-sm">{resource.startDate}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">End Date</span>
              <p className="text-sm">{resource.endDate}</p>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Notes</span>
            <p className="text-sm">{resource.notes}</p>
          </div>
        </div>
      )}
    </div>
  );

  const getTitle = () => {
    switch (type) {
      case 'intern': return resource.name || 'Intern Details';
      case 'seniority': return resource.level || 'Seniority Details';
      case 'skill': return resource.category || 'Skill Details';
      case 'aging': return resource.bucket || 'Aging Details';
      case 'engagement': return resource.type || 'Engagement Details';
      default: return 'Resource Details';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <Separator />
        
        <div className="py-4">
          {type === 'intern' ? renderInternDetails() : renderResourceDetails()}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Edit Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
