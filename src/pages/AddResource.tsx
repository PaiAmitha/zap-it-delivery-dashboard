
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { X, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { HRDataForm } from "@/components/forms/HRDataForm";
import { ResourceManagementForm } from "@/components/forms/ResourceManagementForm";
import { InternDataForm } from "@/components/forms/InternDataForm";
import { FinanceDataForm } from "@/components/forms/FinanceDataForm";
import { ScrollArea } from "@/components/ui/scroll-area";

const AddResource = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    billableStatus: "",
    currentEngagement: "",
    projectName: "",
    projectDescription: "",
    engagementStartDate: "",
    engagementEndDate: "",
    agingInNonBillable: "",
    currentBenchStatus: "",
    engagementDetail: "",
    
    // Intern Fields
    internshipStartDate: "",
    internshipEndDate: "",
    assignedProject: "",
    mentorName: "",
    stipend: "",
    
    // Finance Fields
    monthlySalaryCost: "",
    billingRate: "",
    monthlyRevenueGenerated: "",
    costCenter: "",
    totalYTDCost: "",
    totalYTDRevenue: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Resource Added Successfully",
      description: "New resource has been added to the system.",
    });
    navigate("/resource-management");
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isIntern = formData.seniorityLevel === "Intern";

  return (
    <div className="space-y-6 h-screen flex flex-col">
      <Breadcrumb />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Resource</h1>
          <p className="text-gray-600">Create a new employee record with complete details</p>
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
        <Tabs defaultValue="hr" className="flex-1 flex flex-col">
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
                  <HRDataForm formData={formData} handleInputChange={handleInputChange} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="resource" className="h-full">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  <ResourceManagementForm formData={formData} handleInputChange={handleInputChange} />
                </div>
              </ScrollArea>
            </TabsContent>

            {isIntern && (
              <TabsContent value="intern" className="h-full">
                <ScrollArea className="h-full">
                  <div className="space-y-6 pr-4">
                    <InternDataForm formData={formData} handleInputChange={handleInputChange} />
                  </div>
                </ScrollArea>
              </TabsContent>
            )}

            <TabsContent value="finance" className="h-full">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  <FinanceDataForm formData={formData} handleInputChange={handleInputChange} />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-4 pt-6 border-t bg-white">
          <Button type="submit" className="px-8">
            <Save className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddResource;
