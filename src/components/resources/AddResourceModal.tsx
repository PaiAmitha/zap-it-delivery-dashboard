import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { ResourceData } from "@/types/resource";
import { createResource } from "@/lib/api";
import { HRDataForm } from "@/components/forms/HRDataForm";
import { ResourceManagementForm } from "@/components/forms/ResourceManagementForm";
import { InternDataForm } from "@/components/forms/InternDataForm";
import { FinanceDataForm } from "@/components/forms/FinanceDataForm";

interface AddResourceModalProps {
  onAdd: (newResource: ResourceData) => void;
  onCancel: () => void;
}

export const AddResourceModal = ({ onAdd, onCancel }: AddResourceModalProps) => {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    // If billableStatus, always set as boolean
    if (field === "billableStatus") {
      setFormData((prev: any) => ({ ...prev, [field]: value === true || value === "true" ? true : false }));
    } else if (field === "currentBenchStatus" || field === "isIntern") {
      setFormData((prev: any) => ({ ...prev, [field]: value === true || value === "true" ? true : false }));
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handleAdd = async () => {
    setIsSubmitting(true);
    setError(null);
    console.log("[AddResourceModal] Add button clicked");
    // Convert string values to booleans for backend compatibility
    const billableStatus = formData.billableStatus === true || formData.billableStatus === "true" || formData.billableStatus === "Billable" ? true : false;
    const currentBenchStatus = formData.currentBenchStatus === true || formData.currentBenchStatus === "true" ? true : false;
    const isIntern = formData.isIntern === true || formData.isIntern === "true" ? true : false;
    const newResource: ResourceData = {
      resourceId: formData.resourceId || "",
      fullName: formData.fullName || "",
      designation: formData.designation || "",
      department: formData.department || "",
      reportingManager: formData.reportingManager || "",
      location: formData.location || "",
      joiningDate: formData.joiningDate || "",
      employmentType: formData.employmentType || "",
      experience: parseInt(formData.experience) || 0,
      seniorityLevel: formData.seniorityLevel || "",
      skills: formData.skills ? formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      billableStatus,
      currentEngagement: formData.currentEngagement || "",
      engagementDescription: formData.engagementDescription || "",
      engagementStartDate: formData.engagementStartDate || undefined,
      engagementEndDate: formData.engagementEndDate || undefined,
      agingInNonBillable: parseInt(formData.agingInNonBillable) || 0,
      currentBenchStatus,
      engagementDetail: formData.engagementDetail || "",
      isIntern,
      internshipStartDate: formData.internshipStartDate || undefined,
      internshipEndDate: formData.internshipEndDate || undefined,
      assignedProject: formData.assignedProject || undefined,
      mentorName: formData.mentorName || undefined,
      stipend: formData.stipend ? parseInt(formData.stipend) : undefined,
      monthlySalaryCost: parseInt(formData.monthlySalaryCost) || 0,
      billingRate: formData.billingRate ? parseInt(formData.billingRate) : undefined,
      monthlyRevenueGenerated: parseInt(formData.monthlyRevenueGenerated) || 0,
      costCenter: formData.costCenter || "",
      totalYTDCost: parseInt(formData.totalYTDCost) || 0,
      totalYTDRevenue: parseInt(formData.totalYTDRevenue) || 0
    };
    console.log("[AddResourceModal] Attempting POST /resources", newResource);
    const token = localStorage.getItem("token") || "";
    try {
      const result = await createResource(token, newResource);
      console.log("[AddResourceModal] POST /resources result:", result);
      const res: any = result;
      const mapped: ResourceData = {
        resourceId: res.resourceId || res.id || "",
        fullName: res.fullName || res.full_name || "",
        designation: res.designation || "",
        department: res.department || "",
        reportingManager: res.reportingManager || res.reporting_manager || "",
        location: res.location || "",
        joiningDate: res.joiningDate || res.joining_date || "",
        employmentType: res.employmentType || res.employment_type || "",
        experience: res.experience || 0,
        seniorityLevel: res.seniorityLevel || res.seniority_level || "",
        skills: res.skills || [],
        billableStatus: res.billableStatus || false,
        currentEngagement: res.currentEngagement || "",
        engagementDescription: res.engagementDescription || "",
        engagementStartDate: res.engagementStartDate || undefined,
        engagementEndDate: res.engagementEndDate || undefined,
        agingInNonBillable: res.agingInNonBillable || 0,
        currentBenchStatus: res.currentBenchStatus || false,
        engagementDetail: res.engagementDetail || "",
        isIntern: res.isIntern || false,
        internshipStartDate: res.internshipStartDate || undefined,
        internshipEndDate: res.internshipEndDate || undefined,
        assignedProject: res.assignedProject || undefined,
        mentorName: res.mentorName || undefined,
        stipend: res.stipend || undefined,
        monthlySalaryCost: res.monthlySalaryCost || 0,
        billingRate: res.billingRate || undefined,
        monthlyRevenueGenerated: res.monthlyRevenueGenerated || 0,
        costCenter: res.costCenter || "",
        totalYTDCost: res.totalYTDCost || 0,
        totalYTDRevenue: res.totalYTDRevenue || 0
      };
      onAdd(mapped);
    } catch (err) {
      console.error("[AddResourceModal] Failed to add resource", err);
      setError("Failed to add resource: " + (err?.details || err?.message || JSON.stringify(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <Card className="h-full w-full bg-white shadow-2xl overflow-hidden flex flex-col">
        <CardHeader className="border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Add Resource</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Adding..." : "Add Resource"}
              </Button>
            </div>
          </div>
          {error && (
            <div className="text-red-600 mt-2 text-sm font-semibold">{error}</div>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <HRDataForm formData={formData} onChange={handleInputChange} />
              <ResourceManagementForm formData={formData} onChange={handleInputChange} />
              <InternDataForm formData={formData} onChange={handleInputChange} />
              <FinanceDataForm formData={formData} onChange={handleInputChange} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
