
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { HRDataForm } from "@/components/forms/HRDataForm";
import { ResourceDataForm } from "@/components/forms/ResourceDataForm";
import { InternDataForm } from "@/components/forms/InternDataForm";
import { FinanceDataForm } from "@/components/forms/FinanceDataForm";

interface AddEditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  employee?: any;
  mode: "add" | "edit";
}

export const AddEditEmployeeModal = ({
  isOpen,
  onClose,
  onSave,
  employee,
  mode
}: AddEditEmployeeModalProps) => {
  const [formData, setFormData] = useState({
    // HR Details
    employeeId: employee?.employeeId || "",
    fullName: employee?.fullName || "",
    designation: employee?.designation || "",
    department: employee?.department || "",
    seniorityLevel: employee?.seniorityLevel || "",
    experience: employee?.experience || "",
    location: employee?.location || "",
    joiningDate: employee?.joiningDate || "",
    employmentType: employee?.employmentType || "FTE",
    reportingManager: employee?.reportingManager || "",
    onNoticePeriod: employee?.onNoticePeriod || "No",
    lastWorkingDay: employee?.lastWorkingDay || "",
    
    // Resource Details
    primarySkills: employee?.primarySkills || [],
    primarySkillExperience: employee?.primarySkillExperience || "",
    skillCategory: employee?.skillCategory || "",
    skillCategoryExperience: employee?.skillCategoryExperience || "",
    billableStatus: employee?.billableStatus || "Non-Billable",
    currentEngagement: employee?.currentEngagement || "",
    projectName: employee?.projectName || "",
    projectDescription: employee?.projectDescription || "",
    engagementStartDate: employee?.engagementStartDate || "",
    engagementEndDate: employee?.engagementEndDate || "",
    
    // Intern Details
    internName: employee?.internName || "",
    internDuration: employee?.internDuration || "",
    internDepartment: employee?.internDepartment || "",
    assignedProject: employee?.assignedProject || "",
    mentor: employee?.mentor || "",
    education: employee?.education || "",
    stipend: employee?.stipend || "",
    conversionStatus: employee?.conversionStatus || "Medium",
    internStatus: employee?.internStatus || "Active",
    
    // Finance Details
    monthlySalary: employee?.monthlySalary || ""
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

  const isIntern = formData.seniorityLevel === "Intern";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {mode === "add" ? "Add New Resource" : "Edit Resource Details"}
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            {mode === "add" ? "Create a comprehensive employee record" : "Update employee information"}
          </p>
        </DialogHeader>

        <Tabs defaultValue="hr-details" className="w-full">
          <TabsList className={`grid w-full ${isIntern ? 'grid-cols-4' : 'grid-cols-3'} bg-gray-100 p-1 rounded-lg`}>
            <TabsTrigger value="hr-details" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">HR Details</TabsTrigger>
            <TabsTrigger value="resource-details" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Resource Details</TabsTrigger>
            {isIntern && (
              <TabsTrigger value="intern-details" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Intern Details</TabsTrigger>
            )}
            <TabsTrigger value="finance-details" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Finance Details</TabsTrigger>
          </TabsList>

          <TabsContent value="hr-details" className="mt-6">
            <HRDataForm 
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </TabsContent>

          <TabsContent value="resource-details" className="mt-6">
            <ResourceDataForm 
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </TabsContent>

          {isIntern && (
            <TabsContent value="intern-details" className="mt-6">
              <InternDataForm 
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </TabsContent>
          )}

          <TabsContent value="finance-details" className="mt-6">
            <FinanceDataForm 
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t bg-gray-50 -mx-6 px-6 -mb-6 pb-6">
          <Button variant="outline" onClick={onClose} className="px-6">
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-6 bg-blue-500 hover:bg-blue-600">
            {mode === "add" ? "Add Resource" : "Update Resource"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
