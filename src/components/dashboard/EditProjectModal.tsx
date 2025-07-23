import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { ProjectOverviewTab } from "./modal/ProjectOverviewTab";
import { DeliveryMetricsTab } from "./modal/DeliveryMetricsTab";
import { EngineeringTab } from "./modal/EngineeringTab";
import { TeamTab } from "./modal/TeamTab";

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

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData?: any;
}

export const EditProjectModal = ({ isOpen, onClose, projectData }: EditProjectModalProps) => {
  const { toast } = useToast();
  const { triggerCRUDEvent } = useRealtimeData();
  
  const [formData, setFormData] = useState({
    projectName: projectData?.name || "",
    clientName: projectData?.customer || projectData?.client || "",
    projectCategory: projectData?.projectCategory || "",
    description: projectData?.description || "",
    startDate: projectData?.startDate || "2024-01-15",
    endDate: projectData?.endDate || "2024-06-30",
    status: projectData?.status || "Development",
    projectType: "Fixed Bid",
    duration: "24 weeks",
    currentStage: projectData?.currentStage || "Development",
    progress: projectData?.progress || 65,
    health: projectData?.healthStatus || "Healthy",
    
    // Delivery Metrics - all editable
    sprintVelocity: 42,
    predictability: 87,
    defectLeakage: 3,
    onTimeDelivery: 92,
    currentSprint: "Sprint 15",
    sprintProgress: 78,
    burndownRate: "On Track",
    storyPointsComplete: 32,
    storyPointsTotal: 42,
    qualityScore: 8.5,
    customerSatisfaction: 92,
    featureCompletionRate: 89,
    velocityTrend: "Improving",
    
    // Engineering - all editable
    codeCoverage: 94,
    performanceScore: 2.1,
    testCoverage: 78,
    buildSuccessRate: 98,
    deploymentFrequency: "Daily",
    leadTime: "2.3 days",
    mttr: "4.2 hours",
    technicalDebt: "Medium",
    maintainability: "A",
    securityScore: 95,
    dependenciesUpdated: "Current",
    
    // Team - all editable
    teamSize: projectData?.teamSize || 12,
    retentionRate: 85,
    satisfactionScore: 4.2,
    trainingHours: 120,
    utilization: 87,
    
    // Additional fields for full editability
    engineeringManager: "",
    priority: "",
    projectBudget: "",
    requiredSkills: ""
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "Sarah Johnson", role: "Delivery Manager", allocation: 100, billable: true, location: "New York", utilization: "100%", status: "active" },
    { id: "2", name: "Mike Chen", role: "Scrum Master", allocation: 100, billable: true, location: "San Francisco", utilization: "100%", status: "active" },
    { id: "3", name: "Alex Rodriguez", role: "Tech Lead", allocation: 100, billable: true, location: "Austin", utilization: "100%", status: "active" },
    { id: "4", name: "Emily Davis", role: "Senior Developer", allocation: 100, billable: true, location: "London", utilization: "100%", status: "active" },
    { id: "5", name: "James Wilson", role: "Senior Developer", allocation: 100, billable: true, location: "Toronto", utilization: "100%", status: "active" },
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    { name: "MVP Release", progress: 100, status: "completed", date: "3/15/2024" },
    { name: "Beta Testing", progress: 75, status: "on track", date: "4/30/2024" },
    { name: "User Acceptance", progress: 45, status: "on track", date: "5/15/2024" },
    { name: "Production Release", progress: 20, status: "at risk", date: "6/30/2024" }
  ]);

  const [risks, setRisks] = useState<Risk[]>([
    { issue: "Third-party API dependency", owner: "Tech Lead", priority: "high", status: "Active" },
    { issue: "Resource availability", owner: "Delivery Manager", priority: "medium", status: "Mitigated" },
    { issue: "Client approval delays", owner: "CSP", priority: "low", status: "Monitoring" }
  ]);

  const [isSprintDataModalOpen, setIsSprintDataModalOpen] = useState(false);

  const handleSubmit = () => {
    // Trigger CRUD event for project update
    triggerCRUDEvent('updated', 'project', { ...projectData, ...formData });
    
    toast({
      title: "Project Updated",
      description: "Project details have been successfully updated. All dashboard data synchronized.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project - {projectData?.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Project Overview</TabsTrigger>
            <TabsTrigger value="delivery" className="text-xs md:text-sm">Delivery Metrics</TabsTrigger>
            <TabsTrigger value="engineering" className="text-xs md:text-sm">Engineering</TabsTrigger>
            <TabsTrigger value="team" className="text-xs md:text-sm">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ProjectOverviewTab
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
            <DeliveryMetricsTab
              formData={formData}
              setFormData={setFormData}
              onEditSprintDetails={() => setIsSprintDataModalOpen(true)}
              milestones={milestones}
              setMilestones={setMilestones}
              risks={risks}
              setRisks={setRisks}
            />
          </TabsContent>

          <TabsContent value="engineering">
            <EngineeringTab
              formData={formData}
              setFormData={setFormData}
            />
          </TabsContent>

          <TabsContent value="team">
            <TeamTab
              formData={formData}
              setFormData={setFormData}
              teamMembers={teamMembers}
              setTeamMembers={setTeamMembers}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
