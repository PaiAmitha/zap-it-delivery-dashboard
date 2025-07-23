
import { ProjectOverviewForm } from "@/components/forms/ProjectOverviewForm";

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

interface ProjectOverviewTabProps {
  formData: any;
  setFormData: (data: any) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
  risks: Risk[];
  setRisks: (risks: Risk[]) => void;
}

export const ProjectOverviewTab = ({
  formData,
  setFormData,
  teamMembers,
  setTeamMembers,
  milestones,
  setMilestones,
  risks,
  setRisks
}: ProjectOverviewTabProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
