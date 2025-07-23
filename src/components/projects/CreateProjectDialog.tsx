import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverviewForm } from "@/components/forms/ProjectOverviewForm";
import { DeliveryMetricsForm } from "@/components/forms/DeliveryMetricsForm";
import { TeamForm } from "@/components/forms/TeamForm";
import { EngineeringForm } from "@/components/forms/EngineeringForm";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  allocation: number;
  billable: boolean;
  location: string;
  utilization: string;
  status: string;
}

interface Milestone {
  name: string;
  progress: number;
  status: string;
  date: string;
}

interface Risk {
  issue: string;
  owner: string;
  priority: string;
  status: string;
}

export const CreateProjectDialog = ({ open, onOpenChange }: CreateProjectDialogProps) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Project Overview
    projectName: "",
    clientName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Planning",
    projectType: "Fixed Bid",
    duration: "",
    currentStage: "Planning",
    progress: 0,
    health: "Healthy",
    engineeringManager: "",
    priority: "",
    projectBudget: "",
    requiredSkills: "",
    
    // Delivery Metrics
    sprintVelocity: 0,
    predictability: 0,
    defectLeakage: 0,
    onTimeDelivery: 0,
    currentSprint: "",
    sprintProgress: 0,
    burndownRate: "On Track",
    storyPointsComplete: 0,
    storyPointsTotal: 0,
    qualityScore: 0,
    customerSatisfaction: 0,
    featureCompletionRate: 0,
    velocityTrend: "Stable",
    
    // Engineering
    codeCoverage: 0,
    performanceScore: 0,
    testCoverage: 0,
    buildSuccessRate: 0,
    deploymentFrequency: "Weekly",
    leadTime: "",
    mttr: "",
    technicalDebt: "Low",
    maintainability: "A",
    securityScore: 0,
    dependenciesUpdated: "Current",
    
    // Team
    teamSize: 0,
    retentionRate: 0,
    satisfactionScore: 0,
    trainingHours: 0,
    utilization: 0
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);

  const handleSubmit = () => {
    toast({
      title: "Project Created",
      description: "Your project has been created successfully.",
    });
    onOpenChange(false);
    // Reset form
    setFormData({
      projectName: "",
      clientName: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "Planning",
      projectType: "Fixed Bid",
      duration: "",
      currentStage: "Planning",
      progress: 0,
      health: "Healthy",
      engineeringManager: "",
      priority: "",
      projectBudget: "",
      requiredSkills: "",
      sprintVelocity: 0,
      predictability: 0,
      defectLeakage: 0,
      onTimeDelivery: 0,
      currentSprint: "",
      sprintProgress: 0,
      burndownRate: "On Track",
      storyPointsComplete: 0,
      storyPointsTotal: 0,
      qualityScore: 0,
      customerSatisfaction: 0,
      featureCompletionRate: 0,
      velocityTrend: "Stable",
      codeCoverage: 0,
      performanceScore: 0,
      testCoverage: 0,
      buildSuccessRate: 0,
      deploymentFrequency: "Weekly",
      leadTime: "",
      mttr: "",
      technicalDebt: "Low",
      maintainability: "A",
      securityScore: 0,
      dependenciesUpdated: "Current",
      teamSize: 0,
      retentionRate: 0,
      satisfactionScore: 0,
      trainingHours: 0,
      utilization: 0
    });
    setTeamMembers([]);
    setMilestones([]);
    setRisks([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Add New Project
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Project Overview</TabsTrigger>
            <TabsTrigger value="delivery">Delivery Metrics</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="engineering">Engineering Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ProjectOverviewForm
              formData={formData}
              setFormData={setFormData}
              teamMembers={teamMembers}
              setTeamMembers={setTeamMembers}
              milestones={milestones}
              setMilestones={setMilestones}
              risks={risks}
              setRisks={setRisks}
            />
          </TabsContent>

          <TabsContent value="delivery">
            <DeliveryMetricsForm
              formData={formData}
              setFormData={setFormData}
            />
          </TabsContent>

          <TabsContent value="teams">
            <TeamForm
              formData={formData}
              setFormData={setFormData}
              teamMembers={teamMembers}
              setTeamMembers={setTeamMembers}
            />
          </TabsContent>

          <TabsContent value="engineering">
            <Tabs defaultValue="development" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="development">Development</TabsTrigger>
                <TabsTrigger value="qa">QA</TabsTrigger>
              </TabsList>

              <TabsContent value="development">
                <EngineeringForm
                  formData={formData}
                  setFormData={setFormData}
                />
              </TabsContent>

              <TabsContent value="qa">
                <EngineeringForm
                  formData={formData}
                  setFormData={setFormData}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
