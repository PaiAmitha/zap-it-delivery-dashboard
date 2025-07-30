
import { useState } from "react";
import { createEscalation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CreateEscalationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (newEscalation: any) => void;
}

export const CreateEscalationDialog = ({ open, onOpenChange, onCreate }: CreateEscalationDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    priority: "Medium",
    customer: "",
    project: "",
    owner: "",
    status: "Open",
    date_raised: new Date().toISOString().split('T')[0],
    resolution_eta: "",
    description: "",
    businessImpact: "",
    rootCause: "",
    actionTaken: "",
    nextSteps: "",
    stakeholders: "",
    budget: "",
    risk_level: "Medium",
    category: "Technical",
    region: "North America"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      // Map camelCase to snake_case for backend
      const payload = {
        title: formData.title,
        customer: formData.customer,
        project: formData.project,
        owner: formData.owner,
        priority: formData.priority,
        status: formData.status,
        date_raised: formData.date_raised,
        resolution_eta: formData.resolution_eta,
        description: formData.description,
        risk_level: formData.risk_level,
        // Add more mappings as needed
      };
      const newEscalation = await createEscalation(token, payload);
      toast({
        title: "Escalation Created",
        description: "The new escalation has been created successfully.",
      });
      if (onCreate) { onCreate(newEscalation); }
      onOpenChange(false);
      setFormData({
        title: "",
        priority: "Medium",
        customer: "",
        project: "",
        owner: "",
        status: "Open",
        date_raised: new Date().toISOString().split('T')[0],
        resolution_eta: "",
        description: "",
        businessImpact: "",
        rootCause: "",
        actionTaken: "",
        nextSteps: "",
        stakeholders: "",
        budget: "",
        risk_level: "Medium",
        category: "Technical",
        region: "North America"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || 'Failed to create escalation',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⚠️ Create New Escalation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Escalation Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Select value={formData.customer} onValueChange={(value) => handleInputChange("customer", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TechCorp Industries">TechCorp Industries</SelectItem>
                  <SelectItem value="InnovateCorp">InnovateCorp</SelectItem>
                  <SelectItem value="GlobalTech">GlobalTech</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Associated Project *</Label>
              <Select value={formData.project} onValueChange={(value) => handleInputChange("project", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project Alpha">Project Alpha</SelectItem>
                  <SelectItem value="Beta Platform">Beta Platform</SelectItem>
                  <SelectItem value="Customer Portal">Customer Portal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Escalation Owner *</Label>
              <Select value={formData.owner} onValueChange={(value) => handleInputChange("owner", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Process">Process</SelectItem>
                  <SelectItem value="Resource">Resource</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select value={formData.risk_level} onValueChange={(value) => handleInputChange("risk_level", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRaised">Date Raised</Label>
              <Input
                id="date_raised"
                type="date"
                value={formData.date_raised}
                onChange={(e) => handleInputChange("date_raised", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolutionETA">Resolution ETA *</Label>
              <Input
                id="resolution_eta"
                type="date"
                value={formData.resolution_eta}
                onChange={(e) => handleInputChange("resolution_eta", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Impact</Label>
              <Input
                id="budget"
                placeholder="e.g., $10,000"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Detailed description of the escalation"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessImpact">Business Impact</Label>
              <Textarea
                id="businessImpact"
                rows={2}
                placeholder="Describe the business impact"
                value={formData.businessImpact}
                onChange={(e) => handleInputChange("businessImpact", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rootCause">Root Cause Analysis</Label>
              <Textarea
                id="rootCause"
                rows={2}
                placeholder="Analysis of the root cause"
                value={formData.rootCause}
                onChange={(e) => handleInputChange("rootCause", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionTaken">Actions Taken</Label>
              <Textarea
                id="actionTaken"
                rows={2}
                placeholder="Actions taken to resolve the issue"
                value={formData.actionTaken}
                onChange={(e) => handleInputChange("actionTaken", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextSteps">Next Steps</Label>
              <Textarea
                id="nextSteps"
                rows={2}
                placeholder="Planned next steps"
                value={formData.nextSteps}
                onChange={(e) => handleInputChange("nextSteps", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stakeholders">Key Stakeholders</Label>
              <Textarea
                id="stakeholders"
                rows={2}
                placeholder="List of key stakeholders involved"
                value={formData.stakeholders}
                onChange={(e) => handleInputChange("stakeholders", e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
            Create Escalation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
