
import { Button } from "@/components/ui/button";
import { DeliveryMetricsForm } from "@/components/forms/DeliveryMetricsForm";

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

interface DeliveryMetricsTabProps {
  formData: any;
  setFormData: (data: any) => void;
  onEditSprintDetails: () => void;
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
  risks: Risk[];
  setRisks: (risks: Risk[]) => void;
}

export const DeliveryMetricsTab = ({ 
  formData, 
  setFormData, 
  onEditSprintDetails, 
  milestones, 
  setMilestones, 
  risks, 
  setRisks 
}: DeliveryMetricsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={onEditSprintDetails} variant="outline">
          Edit Sprint Details
        </Button>
      </div>

      <DeliveryMetricsForm
        formData={formData}
        setFormData={setFormData}
        milestones={milestones}
        setMilestones={setMilestones}
        risks={risks}
        setRisks={setRisks}
      />
    </div>
  );
};
