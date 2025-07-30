import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { ResourceData } from "@/types/resource";
import { HRDataForm } from "@/components/forms/HRDataForm";
import { ResourceManagementForm } from "@/components/forms/ResourceManagementForm";
import { InternDataForm } from "@/components/forms/InternDataForm";
import { FinanceDataForm } from "@/components/forms/FinanceDataForm";

interface EditResourceModalProps {
  resource: ResourceData;
  onSave: (updatedResource: ResourceData) => void;
  onCancel: () => void;
}

export const EditResourceModal = ({ resource, onSave, onCancel }: EditResourceModalProps) => {
  const [formData, setFormData] = useState({
    // HR Fields
    resourceId: resource.resourceId,
    fullName: resource.fullName,
    designation: resource.designation,
    department: resource.department,
    reportingManager: resource.reportingManager,
    location: resource.location,
    joiningDate: resource.joiningDate,
    employmentType: resource.employmentType,
    experience: resource.experience.toString(),
    seniorityLevel: resource.seniorityLevel,

    // Resource Management Fields
    skills: (resource.skills || []).join(", "),
    billableStatus: resource.billableStatus.toString(),
    currentEngagement: resource.currentEngagement,
    engagementStartDate: resource.engagementStartDate || "",
    engagementEndDate: resource.engagementEndDate || "",
    agingInNonBillable: resource.agingInNonBillable?.toString() || "",
    currentBenchStatus: resource.currentBenchStatus?.toString() || "",
    engagementDetail: resource.engagementDetail,

    // Intern Fields
    internshipStartDate: resource.internshipStartDate || "",
    internshipEndDate: resource.internshipEndDate || "",
    assignedProject: resource.assignedProject || "",
    mentorName: resource.mentorName || "",
    stipend: resource.stipend?.toString() || "",

    // Finance Fields
    monthlySalaryCost: resource.monthlySalaryCost?.toString() || "",
    billingRate: resource.billingRate?.toString() || "",
    monthlyRevenueGenerated: resource.monthlyRevenueGenerated?.toString() || "",
    costCenter: resource.costCenter,
    totalYTDCost: resource.totalYTDCost?.toString() || "",
    totalYTDRevenue: resource.totalYTDRevenue?.toString() || ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Convert form data back to ResourceData format
    const updatedResource: ResourceData = {
      resourceId: formData.resourceId,
      fullName: formData.fullName,
      designation: formData.designation,
      department: formData.department,
      reportingManager: formData.reportingManager,
      location: formData.location,
      joiningDate: formData.joiningDate,
      employmentType: formData.employmentType,
      experience: parseInt(formData.experience) || 0,
      seniorityLevel: formData.seniorityLevel,
      skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
      billableStatus: formData.billableStatus === "true",
      currentEngagement: formData.currentEngagement,
      engagementStartDate: formData.engagementStartDate || undefined,
      engagementEndDate: formData.engagementEndDate || undefined,
      agingInNonBillable: parseInt(formData.agingInNonBillable) || 0,
      currentBenchStatus: formData.currentBenchStatus === "true",
      engagementDetail: formData.engagementDetail,
      internshipStartDate: formData.internshipStartDate || undefined,
      internshipEndDate: formData.internshipEndDate || undefined,
      assignedProject: formData.assignedProject || undefined,
      mentorName: formData.mentorName || undefined,
      stipend: formData.stipend ? parseInt(formData.stipend) : undefined,
      monthlySalaryCost: parseInt(formData.monthlySalaryCost) || 0,
      billingRate: formData.billingRate ? parseInt(formData.billingRate) : undefined,
      monthlyRevenueGenerated: parseInt(formData.monthlyRevenueGenerated) || 0,
      costCenter: formData.costCenter,
      totalYTDCost: parseInt(formData.totalYTDCost) || 0,
      totalYTDRevenue: parseInt(formData.totalYTDRevenue) || 0
    };

    onSave(updatedResource);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <Card className="h-full w-full bg-white shadow-2xl overflow-hidden flex flex-col">
        <CardHeader className="border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Edit Resource Details - {resource.fullName}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="h-full flex flex-col">
            <Tabs defaultValue="hr" className="flex-1 flex flex-col">
              <div className="border-b px-6 pt-6 pb-2">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="hr">HR Data</TabsTrigger>
                  <TabsTrigger value="resource">Resource Management</TabsTrigger>
                  <TabsTrigger value="intern">Intern Details</TabsTrigger>
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <TabsContent value="hr" className="space-y-6 mt-6">
                  <HRDataForm formData={formData} onChange={handleInputChange} />
                </TabsContent>

                <TabsContent value="resource" className="space-y-6 mt-6">
                  <ResourceManagementForm
                    formData={{
                      primarySkills: resource.skills || [],
                      skillCategory: "",
                      billableStatus: resource.billableStatus ? "true" : "false",
                      currentEngagement: resource.currentEngagement || "",
                      projectName: "",
                      engagementDescription: resource.engagementDescription || "",
                      engagementStartDate: resource.engagementStartDate || "",
                      engagementEndDate: resource.engagementEndDate || "",
                      agingInNonBillable: resource.agingInNonBillable?.toString() || "",
                      currentBenchStatus: resource.currentBenchStatus ? "true" : "false",
                      engagementDetail: resource.engagementDetail || ""
                    }}
                    onChange={handleInputChange}
                  />
                </TabsContent>

                <TabsContent value="intern" className="space-y-6 mt-6">
                  <InternDataForm formData={formData} onChange={handleInputChange} />
                </TabsContent>

                <TabsContent value="finance" className="space-y-6 mt-6">
                  <FinanceDataForm formData={formData} onChange={handleInputChange} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
