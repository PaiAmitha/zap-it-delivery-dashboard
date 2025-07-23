import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ResourceData } from "@/types/resource";
import { EditResourceModal } from "@/components/resources/EditResourceModal";
import { UpcomingEngagementsCard } from "@/components/resource-view/UpcomingEngagementsCard";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Building, 
  User,
  Edit,
  Briefcase,
  Target,
  Award,
  DollarSign
} from "lucide-react";
import employeeData from "@/data/employeeData.json";
import employeeResourceData from "@/data/employeeResourceData.json";

interface ResourceViewData {
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  location: string;
  experience: string;
  email: string;
  phone: string;
  joinedDate: string;
  billableStatus: boolean;
  utilizationRate: number;
  projectSuccessRate: number;
  performanceRating: number;
  skills: string[];
  upcomingEngagements: {
    title: string;
    role: string;
    client: string;
    duration: string;
    status: string;
  }[];
  currentProjects: {
    title: string;
    role: string;
    client: string;
    started: string;
    status: string;
  }[];
  performanceFeedback: {
    reviewer: string;
    date: string;
    rating: number;
    comment: string;
    strengths: string[];
    improvements: string[];
    goals: string[];
  };
}

const ResourceView = () => {
  const { resourceId } = useParams();
  const { toast } = useToast();
  const [resourceData, setResourceData] = useState<ResourceViewData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableResourceData, setEditableResourceData] = useState<ResourceData | null>(null);
  const [isResigned, setIsResigned] = useState(false);

  // Sample upcoming engagements data
  const upcomingEngagements = [
    {
      title: "Mobile Banking App v2.0",
      role: "Lead Frontend Developer",
      client: "TechBank Solutions",
      duration: "6 months",
      startDate: "2025-03-01",
      endDate: "2025-08-30",
      status: "Confirmed"
    },
    {
      title: "E-commerce Platform Redesign",
      role: "Senior UI/UX Developer",
      client: "RetailCorp",
      duration: "4 months",
      startDate: "2025-04-15",
      endDate: "2025-08-15",
      status: "Pipeline"
    }
  ];

  // Sample resigned employees data
  const resignedEmployees = [
    { empId: "EMP001", name: "John Doe" },
    { empId: "EMP002", name: "Jane Smith" },
    { empId: "EMP003", name: "Mike Johnson" },
    { empId: "EMP004", name: "Sarah Wilson" },
    { empId: "EMP005", name: "David Brown" }
  ];

  useEffect(() => {
    // Check if the employee is resigned
    const resignedEmployee = resignedEmployees.find(emp => emp.empId === resourceId);
    if (resignedEmployee) {
      setIsResigned(true);
    }

    // Find employee data from JSON file
    const employee = employeeData.employees.find(emp => emp.employeeId === resourceId);
    if (employee) {
      setResourceData(employee);
    }

    // Find corresponding resource data for editing
    const resourceEmployee = employeeResourceData.employees.find(emp => emp.employee_id === resourceId);
    if (resourceEmployee) {
      // Convert to ResourceData format
      const convertedData: ResourceData = {
        employeeId: resourceEmployee.employee_id,
        fullName: resourceEmployee.full_name,
        designation: resourceEmployee.designation,
        department: resourceEmployee.department,
        seniorityLevel: resourceEmployee.experience_level,
        experience: resourceEmployee.years_of_experience,
        location: resourceEmployee.location,
        joiningDate: resourceEmployee.joining_date,
        employmentType: resourceEmployee.resource_type,
        reportingManager: "Jane Smith", // Default value
        primarySkill: resourceEmployee.primary_skills[0] || "",
        skillCategory: "Application Development", // Default value
        billableStatus: resourceEmployee.status === "Billable",
        currentEngagement: resourceEmployee.status === "Billable" ? "Client Project" : "Available",
        projectName: resourceEmployee.status === "Billable" ? "Current Project" : undefined,
        engagementDescription: resourceEmployee.status === "Billable" ? "Working on client project" : "Available for assignment",
        engagementStartDate: resourceEmployee.bench_start_date ? undefined : "2025-01-01",
        engagementEndDate: resourceEmployee.bench_start_date ? undefined : "2025-12-31",
        agingInNonBillable: resourceEmployee.bench_days || 0,
        currentBenchStatus: resourceEmployee.status !== "Billable",
        engagementDetail: resourceEmployee.status === "Billable" ? "Active Project Work" : "Training/Available",
        isIntern: false,
        internshipStartDate: undefined,
        internshipEndDate: undefined,
        assignedProject: undefined,
        mentorName: undefined,
        stipend: undefined,
        monthlySalaryCost: resourceEmployee.cost_rate,
        billingRate: resourceEmployee.billing_rate || undefined,
        monthlyRevenueGenerated: resourceEmployee.billing_rate || 0,
        costCenter: resourceEmployee.department,
        totalYTDCost: resourceEmployee.cost_rate * 12,
        totalYTDRevenue: (resourceEmployee.billing_rate || 0) * 12
      };
      setEditableResourceData(convertedData);
    }
  }, [resourceId]);

  if (!resourceData) {
    return (
      <div className="space-y-6">
        <BreadcrumbNavigation />
        <div className="text-center">Employee not found</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEditEmployee = () => {
    if (editableResourceData) {
      setIsEditing(true);
    } else {
      toast({
        title: "Error",
        description: "Resource data not available for editing",
        variant: "destructive"
      });
    }
  };

  const handleSaveResource = (updatedResource: ResourceData) => {
    // Update the resource data
    setEditableResourceData(updatedResource);
    
    // Update the display data if possible
    if (resourceData) {
      setResourceData({
        ...resourceData,
        fullName: updatedResource.fullName,
        designation: updatedResource.designation,
        department: updatedResource.department,
        location: updatedResource.location,
        experience: updatedResource.experience.toString(),
        billableStatus: updatedResource.billableStatus
      });
    }

    setIsEditing(false);
    toast({
      title: "Success",
      description: "Employee details updated successfully",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      {/* Header Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">
                  {getInitials(resourceData.fullName)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{resourceData.fullName}</h1>
                <p className="text-gray-600">{resourceData.designation}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Building className="h-4 w-4" />
                    {resourceData.department}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    {resourceData.location}
                  </div>
                  <Badge 
                    variant={isResigned ? "destructive" : "default"} 
                    className={isResigned ? "bg-red-600 text-white" : "bg-gray-900 text-white"}
                  >
                    {isResigned ? "Resigned" : "Active"}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              className="bg-gray-900 text-white hover:bg-gray-800"
              onClick={handleEditEmployee}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Employee
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Experience</p>
                <p className="text-lg font-bold text-blue-900">{resourceData.experience}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600">Years at Company</p>
                <p className="text-lg font-bold text-orange-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Current Projects</p>
                <p className="text-lg font-bold text-purple-900">{resourceData.currentProjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600">Billable Status</p>
                <p className="text-lg font-bold text-green-900">
                  {resourceData.billableStatus ? "Billable" : "Non-Billable"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{resourceData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{resourceData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{resourceData.location}</span>
              </div>
            </CardContent>
          </Card>

          {/* HR Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                HR Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-semibold">{resourceData.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joining Date</p>
                <p className="font-semibold">{resourceData.joinedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employment Type</p>
                <Badge variant="outline">FTE</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Seniority Level</p>
                <p className="font-semibold">Senior</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reporting Manager</p>
                <p className="font-semibold">Jane Smith</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost Center</p>
                <p className="font-semibold">ENG-001</p>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Expertise */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-gray-500 mb-2">Primary Skill</p>
                <p className="font-semibold mb-4">React.js</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Skill Category</p>
                <p className="font-semibold">Frontend</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Current Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resourceData.currentProjects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{project.title}</h4>
                    <Badge variant="default" className="bg-green-600">
                      On Track
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{project.client}</p>
                  <p className="text-sm text-gray-600">{project.role}</p>
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Started</p>
                      <p className="text-sm font-medium">{project.started}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">End Date</p>
                      <p className="text-sm font-medium">2024-06-30</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Billable Hours</p>
                    <p className="text-sm font-medium">320h</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Past Project Engagements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Past Project Engagements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">E-commerce Platform</h4>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Completed Successfully
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">RetailGiant Inc.</p>
                <p className="text-sm text-gray-600">Full Stack Developer</p>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium">7 months</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Period</p>
                    <p className="text-sm font-medium">2023-06-01 - 2023-12-31</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Hours</p>
                    <p className="text-sm font-medium">1120h</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">Banking Dashboard</h4>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Completed Successfully
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">FinanceFirst Bank</p>
                <p className="text-sm text-gray-600">Frontend Developer</p>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium">4.5 months</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Period</p>
                    <p className="text-sm font-medium">2023-01-15 - 2023-05-30</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Hours</p>
                    <p className="text-sm font-medium">720h</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Engagements */}
          <UpcomingEngagementsCard engagements={upcomingEngagements} />
        </div>
      </div>

      {/* Edit Resource Modal */}
      {isEditing && editableResourceData && (
        <EditResourceModal
          resource={editableResourceData}
          onSave={handleSaveResource}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default ResourceView;
