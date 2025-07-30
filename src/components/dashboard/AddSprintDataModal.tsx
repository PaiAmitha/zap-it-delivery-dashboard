import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { SprintDataForm } from "./SprintDataForm";
import { createSprint } from "@/lib/api";

interface AddSprintDataModalProps {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
  projectId?: string | number;
  projectName?: string;
}

export const AddSprintDataModal = ({ isOpen, onClose, projectId, projectName }: AddSprintDataModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (sprintData: any) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      await createSprint(token, projectId, sprintData);
      toast({
        title: "Sprint Data Added",
        description: "Sprint data has been successfully added to the project.",
      });
      onClose(true); // trigger parent refresh
    } catch (err: any) {
      toast({
        title: "Error Adding Sprint",
        description: err?.message || 'Failed to add sprint',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📅 Add Sprint Data - {projectName}
          </DialogTitle>
        </DialogHeader>

        <SprintDataForm onSubmit={handleSubmit} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose(false)} disabled={loading}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
