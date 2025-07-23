
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { ResourceData } from "@/types/resource";
import { ResourceTable } from "@/components/resources/ResourceTable";
import { EditResourceModal } from "@/components/resources/EditResourceModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

const ResourceDetails = () => {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);
  const internId = searchParams.get('id');

  // Sample upcoming projects data
  const upcomingProjects = [
    {
      id: "proj-001",
      name: "Mobile Banking App v2.0",
      startDate: "2025-02-15",
      endDate: "2025-08-30",
      role: "Lead Frontend Developer",
      skillsRequired: ["React Native", "TypeScript", "API Integration"],
      priority: "High",
      client: "TechBank Solutions"
    },
    {
      id: "proj-002", 
      name: "E-commerce Platform Redesign",
      startDate: "2025-03-01",
      endDate: "2025-09-15",
      role: "Senior UI/UX Developer",
      skillsRequired: ["React.js", "UI/UX Design", "Performance Optimization"],
      priority: "Medium",
      client: "RetailCorp"
    },
    {
      id: "proj-003",
      name: "AI Analytics Dashboard",
      startDate: "2025-04-01", 
      endDate: "2025-10-31",
      role: "Full Stack Developer",
      skillsRequired: ["Python", "Machine Learning", "Data Visualization"],
      priority: "High",
      client: "DataTech Inc"
    }
  ];

  // Sample data - replace with actual API calls
  useEffect(() => {
    const sampleData: ResourceData[] = [
      {
        employeeId: "INT001",
        fullName: "Priya Sharma",
        designation: "QA Intern",
        department: "Quality Assurance",
        seniorityLevel: "Intern",
        experience: 0,
        location: "Mumbai",
        joiningDate: "2024-06-01",
        employmentType: "Intern",
        reportingManager: "Sarah Wilson",
        primarySkill: "Manual Testing",
        skillCategory: "Quality Assurance",
        billableStatus: false,
        currentEngagement: "QA Training Program",
        projectName: undefined,
        engagementDescription: "Comprehensive QA training and hands-on project work",
        engagementStartDate: "2024-06-01",
        engagementEndDate: "2024-09-01",
        agingInNonBillable: 0,
        currentBenchStatus: false,
        engagementDetail: "QA Intern - Training Program",
        isIntern: true,
        internshipStartDate: "2024-06-01",
        internshipEndDate: "2024-09-01",
        assignedProject: "E-commerce Testing",
        mentorName: "Sarah Wilson",
        stipend: 2500,
        monthlySalaryCost: 2500,
        billingRate: undefined,
        monthlyRevenueGenerated: 0,
        costCenter: "Quality Assurance",
        totalYTDCost: 7500,
        totalYTDRevenue: 0,
      },
      {
        employeeId: "INT002",
        fullName: "Arjun Patel",
        designation: "Software Development Intern",
        department: "Engineering",
        seniorityLevel: "Intern",
        experience: 0,
        location: "Bangalore",
        joiningDate: "2024-01-15",
        employmentType: "Intern",
        reportingManager: "John Doe",
        primarySkill: "React.js",
        skillCategory: "Application Development",
        billableStatus: false,
        currentEngagement: "Frontend Development Training",
        projectName: undefined,
        engagementDescription: "Frontend development training with React.js and modern tools",
        engagementStartDate: "2024-01-15",
        engagementEndDate: "2024-07-15",
        agingInNonBillable: 0,
        currentBenchStatus: false,
        engagementDetail: "Software Development Intern - Frontend Track",
        isIntern: true,
        internshipStartDate: "2024-01-15",
        internshipEndDate: "2024-07-15",
        assignedProject: "Dashboard Redesign",
        mentorName: "John Doe",
        stipend: 3000,
        monthlySalaryCost: 3000,
        billingRate: undefined,
        monthlyRevenueGenerated: 0,
        costCenter: "Engineering",
        totalYTDCost: 18000,
        totalYTDRevenue: 0,
      },
    ];

    // Filter based on type and intern ID if provided
    let filteredData = sampleData;
    
    if (type === "interns") {
      filteredData = sampleData.filter(r => r.isIntern);
      
      // If a specific intern ID is provided, filter to that intern
      if (internId) {
        filteredData = filteredData.filter(r => r.employeeId === internId);
      }
    } else if (type === "billable") {
      filteredData = sampleData.filter(r => r.billableStatus && !r.isIntern);
    } else if (type === "non-billable") {
      filteredData = sampleData.filter(r => !r.billableStatus && !r.isIntern);
    }

    setResources(filteredData);
  }, [type, internId]);

  const getTypeTitle = () => {
    if (type === "interns" && internId) {
      const intern = resources.find(r => r.employeeId === internId);
      return intern ? `Intern Details - ${intern.fullName}` : "Intern Details";
    }
    
    switch (type) {
      case "billable": return "Billable Resources";
      case "non-billable": return "Non-Billable Resources";
      case "interns": return "Intern Resources";
      default: return "All Resources";
    }
  };

  const handleEdit = (resource: ResourceData) => {
    setSelectedResource(resource);
    setIsEditing(true);
  };

  const handleView = (resource: ResourceData) => {
    navigate(`/resource-view/${resource.employeeId}`);
  };

  const handleSave = (updatedResource: ResourceData) => {
    // Update the resources array with the new data
    setResources(prev => 
      prev.map(resource => 
        resource.employeeId === updatedResource.employeeId 
          ? updatedResource 
          : resource
      )
    );
    
    toast({
      title: "Success",
      description: "Resource details updated successfully",
    });
    setIsEditing(false);
    setSelectedResource(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedResource(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getTypeTitle()}</h1>
          <p className="text-gray-600">
            {internId ? "Detailed view of intern information and performance" : `Detailed view and management of ${type} resources`}
          </p>
        </div>
      </div>

      <ResourceTable 
        resources={resources} 
        onEdit={handleEdit}
        onView={handleView}
      />

      {/* Show upcoming projects only if not viewing a specific intern */}
      {!internId && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Calendar className="h-5 w-5" />
              Upcoming Projects Pipeline
            </CardTitle>
            <p className="text-blue-700 text-sm">Future project allocations and opportunities</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingProjects.map((project) => (
                <Card key={project.id} className="bg-white border-blue-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{project.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{project.client}</p>
                      </div>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p className="font-medium text-gray-900">{new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">End Date</p>
                        <p className="font-medium text-gray-900">{new Date(project.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Role</p>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <p className="text-xs font-medium text-gray-900">{project.role}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {project.skillsRequired.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        Duration: {Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Resource Modal */}
      {isEditing && selectedResource && (
        <EditResourceModal
          resource={selectedResource}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default ResourceDetails;
