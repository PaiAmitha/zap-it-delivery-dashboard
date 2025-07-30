import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { HRDataForm } from "@/components/forms/HRDataForm";
import { ResourceDataForm } from "@/components/forms/ResourceDataForm";
import { InternDataForm } from "@/components/forms/InternDataForm";
import { FinanceDataForm } from "@/components/forms/FinanceDataForm";
import { AddResourceModal } from "./AddResourceModal";

interface AddEditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  resource?: any;
  mode: "add" | "edit";
};

export const AddEditResourceModal = ({
  isOpen,
  onClose,
  onSave,
  resource,
  mode
}: AddEditResourceModalProps) => {
  const [formData, setFormData] = useState({
    // HR Details
    employeeId: resource?.employeeId || "",
    fullName: resource?.fullName || "",
    designation: resource?.designation || "",
    department: resource?.department || "",
    seniorityLevel: resource?.seniorityLevel || "",
    experience: resource?.experience || "",
    location: resource?.location || "",
    joiningDate: resource?.joiningDate || "",
    employmentType: resource?.employmentType || "FTE",
    reportingManager: resource?.reportingManager || "",
    onNoticePeriod: resource?.onNoticePeriod || "No",
    lastWorkingDay: resource?.lastWorkingDay || "",
    // Resource Details
    primarySkills: resource?.primarySkills || [],
    primarySkillExperience: resource?.primarySkillExperience || "",
    skillCategory: resource?.skillCategory || "",
    skillCategoryExperience: resource?.skillCategoryExperience || "",
    billableStatus: resource?.billableStatus || "Non-Billable",
    currentEngagement: resource?.currentEngagement || "",
    projectName: resource?.projectName || "",
    projectDescription: resource?.projectDescription || "",
    engagementStartDate: resource?.engagementStartDate || "",
    engagementEndDate: resource?.engagementEndDate || "",
    // Intern Details
    internName: resource?.internName || "",
    internDuration: resource?.internDuration || "",
    internDepartment: resource?.internDepartment || "",
    assignedProject: resource?.assignedProject || "",
    mentor: resource?.mentor || "",
    education: resource?.education || "",
    stipend: resource?.stipend || "",
    conversionStatus: resource?.conversionStatus || "Medium",
    internStatus: resource?.internStatus || "Active",
    // Finance Details
    monthlySalary: resource?.monthlySalary || ""
  });

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Ensure salary values have $ prefix
    const processedData = {
      ...formData,
      monthlySalary: formData.monthlySalary.startsWith('$') ? formData.monthlySalary : `$${formData.monthlySalary}`,
      stipend: formData.stipend && !formData.stipend.startsWith('$') ? `$${formData.stipend}` : formData.stipend,
    };
    onSave(processedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Resource" : "Edit Resource"}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="hr" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="hr">HR Data</TabsTrigger>
            <TabsTrigger value="resource">Resource</TabsTrigger>
            <TabsTrigger value="intern">Intern</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>
          <TabsContent value="hr">
            <HRDataForm formData={formData} onChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="resource">
            <ResourceDataForm formData={formData} onChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="intern">
            <InternDataForm formData={formData} onChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="finance">
            <FinanceDataForm formData={formData} onChange={handleInputChange} />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{mode === "add" ? "Add Resource" : "Save Changes"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
