import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ProjectOverviewForm } from "@/components/forms/ProjectOverviewForm";
import { DeliveryMetricsForm } from "@/components/forms/DeliveryMetricsForm";
import { EngineeringForm } from "@/components/forms/EngineeringForm";
import { TeamForm } from "@/components/forms/TeamForm";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";

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

const AddProject = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Project Created Successfully",
      description: "New project has been created in the system.",
    });
    console.log("Project form submitted:", { formData, teamMembers, milestones, risks });
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Project</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Create a comprehensive project with all details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Project Overview</TabsTrigger>
                <TabsTrigger value="delivery">Delivery Metrics</TabsTrigger>
                <TabsTrigger value="engineering">Engineering</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
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

              <TabsContent value="engineering">
                <EngineeringForm
                  formData={formData}
                  setFormData={setFormData}
                />
              </TabsContent>

              <TabsContent value="team">
                <TeamForm
                  formData={formData}
                  setFormData={setFormData}
                  teamMembers={teamMembers}
                  setTeamMembers={setTeamMembers}
                />
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" className="px-8">
                Create Project
              </Button>
              <Link to="/resource-management">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProject;
