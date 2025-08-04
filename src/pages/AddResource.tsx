import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { X, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { HRDataForm } from "@/components/forms/HRDataForm";
import { ResourceManagementForm } from "@/components/forms/ResourceManagementForm";
import { InternDataForm } from "@/components/forms/InternDataForm";
import { FinanceDataForm } from "@/components/forms/FinanceDataForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createResource, updateResource } from "@/lib/api";

const AddResource = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  let initialFormData = {
    email: "",
    phone: "",
    // HR Fields
    employeeId: "",
    fullName: "",
    designation: "",
    department: "",
    reportingManager: "",
    location: "",
    joiningDate: "",
    employmentType: "",
    experience: "",
    seniorityLevel: "",
    onNoticePeriod: "",
    lastWorkingDay: "",
    // Resource Management Fields
    primarySkills: [] as string[],
    skillCategory: "",
    billableStatus: "false" as "true" | "false",
    currentEngagement: "",
    projectName: "",
    engagementDescription: "",
    engagementStartDate: "",
    engagementEndDate: "",
    agingInNonBillable: "",
    currentBenchStatus: "false" as "true" | "false",
    engagementDetail: "",
    // Intern Fields
    internName: "",
    internDuration: "",
    internDepartment: "",
    mentor: "",
    internshipStartDate: "",
    internshipEndDate: "",
    assignedProject: "",
    mentorName: "",
    stipend: "",
    education: "",
    internStatus: "",
    conversionStatus: "",
    // Finance Fields
    monthlySalary: "",
    monthlySalaryCost: "",
    billingRate: "",
    monthlyRevenueGenerated: "",
    costCenter: "",
    totalYTDCost: "",
    totalYTDRevenue: ""
  };
  // If editing, pre-fill formData from location.state.resource
  let editResource = null;
  try {
    if (location.state && location.state.resource) {
      editResource = location.state.resource;
      initialFormData = { ...initialFormData, ...editResource, monthlySalary: editResource.monthlySalaryCost?.toString() || "" };
    }
  } catch {}
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('hr');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    // Ensure employeeId is always a non-empty string
    if (!formData.employeeId || typeof formData.employeeId !== "string" || formData.employeeId.trim() === "") {
      setLoading(false);
      setError("Employee ID is required and cannot be empty.");
      return;
    }
    try {
      const token = localStorage.getItem('token') || '';
      // Map formData to ResourceData
      // Ensure skills and primarySkills are always arrays, never null
      const skillsArray = Array.isArray(formData.primarySkills)
        ? formData.primarySkills.filter(s => !!s)
        : [];
      let resourceData;
      if (formData.seniorityLevel === "Intern") {
        // Calculate start and end dates
        const startDate = new Date();
        let months = 0;
        switch (formData.internDuration) {
          case "2 months": months = 2; break;
          case "3 months": months = 3; break;
          case "6 months": months = 6; break;
          case "12 months": months = 12; break;
          default: months = 0;
        }
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + months);
        // Format dates as YYYY-MM-DD
        const formatDate = (date: Date) => date.toISOString().split("T")[0];
        resourceData = {
          employeeId: formData.employeeId,
          name: formData.internName || formData.fullName,
          fullName: formData.internName || formData.fullName,
          email: formData.email,
          phone: formData.phone,
          duration: formData.internDuration,
          department: formData.internDepartment || formData.department,
          assignedProject: formData.assignedProject,
          mentor: formData.mentor,
          mentorName: formData.mentor,
          stipend: formData.stipend ? parseInt(formData.stipend) : undefined,
          education: formData.education,
          status: formData.internStatus,
          conversionPotential: formData.conversionStatus,
          internshipStartDate: formatDate(startDate),
          internshipEndDate: formatDate(endDate),
          seniorityLevel: formData.seniorityLevel,
          is_intern: true
        };
      } else {
        resourceData = {
          employeeId: formData.employeeId,
          email: formData.email,
          phone: formData.phone,
          fullName: formData.fullName,
          designation: formData.designation,
          department: formData.department,
          reportingManager: formData.reportingManager,
          location: formData.location,
          joiningDate: formData.joiningDate,
          employmentType: formData.employmentType,
          experience: parseInt(formData.experience) || 0,
          seniorityLevel: formData.seniorityLevel,
          skills: skillsArray,
          primarySkills: skillsArray,
          billableStatus: String(formData.billableStatus) === "true",
          currentEngagement: formData.currentEngagement,
          engagementStartDate: formData.engagementStartDate,
          engagementEndDate: formData.engagementEndDate,
          agingInNonBillable: parseInt(formData.agingInNonBillable) || 0,
          currentBenchStatus: String(formData.currentBenchStatus) === "true",
          engagementDetail: formData.engagementDetail,
          monthlySalaryCost: parseInt(formData.monthlySalary) || 0,
          billingRate: formData.billingRate ? parseInt(formData.billingRate) : undefined,
          monthlyRevenueGenerated: parseInt(formData.monthlyRevenueGenerated) || 0,
          costCenter: formData.costCenter,
          totalYTDCost: parseInt(formData.totalYTDCost) || 0,
          totalYTDRevenue: parseInt(formData.totalYTDRevenue) || 0,
          lastWorkingDay: formData.lastWorkingDay
        };
      }
      console.log('Submitting to endpoint:', '/resources');
      console.log('Submitting resourceData:', resourceData);
      if (editResource) {
        await updateResource(token, editResource.id, resourceData);
        setSuccess(true);
        toast({ title: "Resource updated", description: "Resource details updated successfully.", variant: "default" });
      } else {
        await createResource(token, resourceData);
        setSuccess(true);
        toast({ title: "Resource added", description: "Resource details saved successfully.", variant: "default" });
      }
      // After add/edit, redirect to resource management resources tab
      navigate("/resource-management", { state: { refresh: true } });
    } catch (err: any) {
      console.error('Resource creation error:', err);
      setError(err?.message || err?.details || 'Failed to add resource');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => {
      // If seniorityLevel is set to Intern, auto-switch tab
      if (field === 'seniorityLevel' && value === 'Intern') {
        setActiveTab('intern');
      }
      return { ...prev, [field]: value };
    });
  };

  const isIntern = formData.seniorityLevel === "Intern";

  return (
    <div className="space-y-6 h-screen flex flex-col">
      <Breadcrumb />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{editResource ? "Edit Resource" : "Add New Resource"}</h1>
          <p className="text-gray-600">{editResource ? "Update employee record details" : "Create a new employee record with complete details"}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/resource-management">
            <Button variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
        {loading && <div className="text-blue-500">Adding resource...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">Resource added successfully!</div>}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className={`grid w-full ${isIntern ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="hr">HR Data</TabsTrigger>
            <TabsTrigger value="resource">Resource Management</TabsTrigger>
            {isIntern && <TabsTrigger value="intern">Intern Section</TabsTrigger>}
            <TabsTrigger value="finance">Finance Section</TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0">
            <TabsContent value="hr" className="h-full">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
        <HRDataForm formData={formData} onChange={handleInputChange} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="resource" className="h-full">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  <ResourceManagementForm
                    formData={{
                      primarySkills: formData.primarySkills,
                      skillCategory: formData.skillCategory,
                      billableStatus: formData.billableStatus as "true" | "false",
                      currentEngagement: formData.currentEngagement,
                      projectName: formData.projectName,
                      engagementDescription: formData.engagementDescription,
                      engagementStartDate: formData.engagementStartDate,
                      engagementEndDate: formData.engagementEndDate,
                      agingInNonBillable: formData.agingInNonBillable,
                      currentBenchStatus: formData.currentBenchStatus as "true" | "false",
                      engagementDetail: formData.engagementDetail
                    }}
                    onChange={handleInputChange}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            {isIntern && (
              <TabsContent value="intern" className="h-full">
                <ScrollArea className="h-full">
                  <div className="space-y-6 pr-4">
        <InternDataForm formData={formData} onChange={handleInputChange} />
                  </div>
                </ScrollArea>
              </TabsContent>
            )}

            <TabsContent value="finance" className="h-full">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
          <FinanceDataForm formData={formData} onChange={handleInputChange} />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-4 pt-6 border-t bg-white">
        <Button type="submit" className="px-8">
          <Save className="h-4 w-4 mr-2" />
          {editResource ? "Update Resource" : "Add Resource"}
        </Button>
        </div>
      </form>
    </div>
  );
};

export default AddResource;
