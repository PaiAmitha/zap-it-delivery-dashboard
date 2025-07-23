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
import { getEmployees } from "@/lib/api";
import { Employee } from "@/types/employee";

const ResourceDetails = () => {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const internId = searchParams.get('id');

  // Fetch resources from backend
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const data = await getEmployees(token) as { employees?: Employee[] } | Employee[];
        const employeesList = Array.isArray(data) ? data : (data.employees || []);
        // Map Employee[] to ResourceData[]
        let mapped = employeesList.map(emp => ({
          employeeId: emp.employee_id,
          fullName: emp.full_name,
          designation: emp.designation,
          department: emp.department,
          seniorityLevel: emp.experience_level,
          experience: emp.years_of_experience,
          location: emp.location,
          joiningDate: emp.joining_date,
          employmentType: emp.resource_type,
          reportingManager: (emp as any).reporting_manager || '',
          primarySkill: emp.primary_skills[0] || '',
          skillCategory: 'Application Development', // Placeholder
          billableStatus: emp.status === 'Billable',
          currentEngagement: emp.status === 'Billable' ? 'Client Project' : 'Available',
          projectName: emp.status === 'Billable' ? 'Current Project' : undefined,
          engagementDescription: emp.status === 'Billable' ? 'Working on client project' : 'Available for assignment',
          engagementStartDate: emp.bench_start_date ? undefined : '2025-01-01',
          engagementEndDate: emp.bench_start_date ? undefined : '2025-12-31',
          agingInNonBillable: emp.bench_days || 0,
          currentBenchStatus: emp.status !== 'Billable',
          engagementDetail: emp.status === 'Billable' ? 'Active Project Work' : 'Training/Available',
          isIntern: false, // Set true if intern logic is available
          internshipStartDate: undefined,
          internshipEndDate: undefined,
          assignedProject: undefined,
          mentorName: undefined,
          stipend: undefined,
          monthlySalaryCost: emp.cost_rate,
          billingRate: emp.billing_rate || undefined,
          monthlyRevenueGenerated: emp.billing_rate || 0,
          costCenter: emp.department,
          totalYTDCost: emp.cost_rate * 12,
          totalYTDRevenue: (emp.billing_rate || 0) * 12,
        }));
        // Filter based on type and intern ID if provided
        if (type === "interns") {
          mapped = mapped.filter(r => r.isIntern);
          if (internId) {
            mapped = mapped.filter(r => r.employeeId === internId);
          }
        } else if (type === "billable") {
          mapped = mapped.filter(r => r.billableStatus && !r.isIntern);
        } else if (type === "non-billable") {
          mapped = mapped.filter(r => !r.billableStatus && !r.isIntern);
        }
        setResources(mapped);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
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
      {loading && (
        <Card className="mx-1 sm:mx-0">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Loading resources...</p>
          </CardContent>
        </Card>
      )}
      {error && (
        <Card className="mx-1 sm:mx-0">
          <CardContent className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <>
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
                  {/* {upcomingProjects.map((project) => (
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
                  ))} */}
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
        </>
      )}
    </div>
  );
};

export default ResourceDetails;
