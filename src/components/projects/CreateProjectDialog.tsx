import { useState } from "react";
import { createProject } from "@/lib/api";
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = localStorage.getItem('token') || '';
      // Map frontend fields to backend expected fields
      const payload = {
        // Project Overview
        name: formData.projectName,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        budget: formData.projectBudget ? Number(formData.projectBudget.replace(/[^\d.]/g, "")) : undefined,
        required_skills: formData.requiredSkills,
        start_date: formData.startDate,
        end_date: formData.endDate,
        health_status: formData.health,
        project_type: formData.projectType,
        current_stage: formData.currentStage,
        progress: formData.progress,
        engineering_manager: formData.engineeringManager,
        // Delivery Metrics
        sprint_velocity: formData.sprintVelocity,
        predictability: formData.predictability,
        defect_leakage: formData.defectLeakage,
        on_time_delivery: formData.onTimeDelivery,
        current_sprint: formData.currentSprint,
        sprint_progress: formData.sprintProgress,
        burndown_rate: formData.burndownRate,
        story_points_complete: formData.storyPointsComplete,
        story_points_total: formData.storyPointsTotal,
        quality_score: formData.qualityScore,
        customer_satisfaction: formData.customerSatisfaction,
        feature_completion_rate: formData.featureCompletionRate,
        velocity_trend: formData.velocityTrend,
        // Engineering Metrics
        code_coverage: formData.codeCoverage,
        performance_score: formData.performanceScore,
        test_coverage: formData.testCoverage,
        build_success_rate: formData.buildSuccessRate,
        deployment_frequency: formData.deploymentFrequency,
        lead_time: formData.leadTime,
        mttr: formData.mttr,
        technical_debt: formData.technicalDebt,
        maintainability: formData.maintainability,
        security_score: formData.securityScore,
        dependencies_updated: formData.dependenciesUpdated,
        // Team Metrics
        team_size: formData.teamSize,
        retention_rate: formData.retentionRate,
        satisfaction_score: formData.satisfactionScore,
        training_hours: formData.trainingHours,
        utilization: formData.utilization,
        // Relationships
        teamMembers,
        milestones,
        risks,
      };
      await createProject(token, payload);
      setSuccess(true);
      toast({
        title: "Project Created Successfully",
        description: "New project has been created in the system.",
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
    } catch (err: any) {
      setError(err?.message || 'Failed to create project');
      toast({
        title: "Failed to Create Project",
        description: err?.message || 'Failed to create project',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">Project created successfully!</div>}
      </DialogContent>
    </Dialog>
  );
};
