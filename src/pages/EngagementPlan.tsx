
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EngagementPlan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const resourceId = searchParams.get('resourceId');
  
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    projectName: "",
    clientName: "",
    shadowAccount: "",
    trainingProgram: "",
    mentorName: "",
    description: "",
    estimatedDuration: "",
    priority: "medium"
  });

  // Mock resource data - in real app, fetch based on resourceId
  const resourceData = {
    id: resourceId || "EMP001",
    name: "Alex Rodriguez",
    role: "Frontend Developer",
    releaseDate: "2025-08-15",
    skills: ["React.js", "Node.js", "TypeScript", "AWS"]
  };

  const engagementOptions = [
    { id: "awaiting", label: "Awaiting Engagement Plan", description: "Resource is available and awaiting assignment" },
    { id: "shadow", label: "Shadow to an Ongoing Account", description: "Shadowing an experienced team member on active project" },
    { id: "temporary", label: "Temporary Allocation – POC / Internal / Small Project", description: "Short-term project or proof of concept work" },
    { id: "training", label: "Training", description: "Skill development and training programs" },
    { id: "future", label: "Future Project", description: "Pre-allocation for upcoming project" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!selectedPlan) {
      toast({
        title: "Selection Required",
        description: "Please select an engagement plan option.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save the engagement plan
    toast({
      title: "Engagement Plan Submitted",
      description: `Plan "${engagementOptions.find(opt => opt.id === selectedPlan)?.label}" has been saved for ${resourceData.name}.`,
    });

    navigate("/resource-management");
  };

  const renderFormFields = () => {
    switch (selectedPlan) {
      case "awaiting":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Additional Notes</Label>
              <Textarea
                id="description"
                placeholder="Any specific requirements or preferences..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
          </div>
        );

      case "shadow":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="shadowAccount">Account/Project to Shadow</Label>
              <Input
                id="shadowAccount"
                placeholder="Enter account or project name"
                value={formData.shadowAccount}
                onChange={(e) => handleInputChange("shadowAccount", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="mentorName">Mentor/Supervisor</Label>
              <Input
                id="mentorName"
                placeholder="Enter mentor name"
                value={formData.mentorName}
                onChange={(e) => handleInputChange("mentorName", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                <Input
                  id="estimatedDuration"
                  placeholder="e.g., 2 months"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case "temporary":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={formData.projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clientName">Client/Department</Label>
              <Input
                id="clientName"
                placeholder="Enter client or department name"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "training":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="trainingProgram">Training Program</Label>
              <Input
                id="trainingProgram"
                placeholder="Enter training program name"
                value={formData.trainingProgram}
                onChange={(e) => handleInputChange("trainingProgram", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="estimatedDuration">Duration</Label>
                <Input
                  id="estimatedDuration"
                  placeholder="e.g., 3 weeks"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Training Objectives</Label>
              <Textarea
                id="description"
                placeholder="Describe the learning objectives and expected outcomes..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
          </div>
        );

      case "future":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName">Future Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={formData.projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clientName">Client</Label>
              <Input
                id="clientName"
                placeholder="Enter client name"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Expected Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the project and role requirements..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <BreadcrumbNavigation />
        
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Engagement Plan</h1>
            <p className="text-blue-100 text-sm sm:text-base">Configure engagement plan for releasing resource</p>
          </div>
        </div>

        {/* Resource Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Resource Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
                {resourceData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{resourceData.name}</h3>
                <p className="text-gray-600">{resourceData.role}</p>
                <p className="text-sm text-gray-500">Release Date: {resourceData.releaseDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {resourceData.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Plan Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Engagement Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-4">
              {engagementOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Dynamic Form Fields */}
        {selectedPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
            </CardHeader>
            <CardContent>
              {renderFormFields()}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/resource-management")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit Engagement Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EngagementPlan;
