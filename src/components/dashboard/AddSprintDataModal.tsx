
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { SprintDataForm } from "./SprintDataForm";

interface AddSprintDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export const AddSprintDataModal = ({ isOpen, onClose, projectName }: AddSprintDataModalProps) => {
  const { toast } = useToast();

  const handleSubmit = (sprintData: any) => {
    console.log("Sprint data submitted:", sprintData);
    toast({
      title: "Sprint Data Added",
      description: "Sprint data has been successfully added to the project.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📅 Add Sprint Data - {projectName}
          </DialogTitle>
        </DialogHeader>

        <SprintDataForm onSubmit={handleSubmit} />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
