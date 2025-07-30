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
import { getResource, getProjects, getUpcomingReleases } from "@/lib/api";
const ResourceView = () => {
  // Helper to calculate years at company from joiningDate
  const getYearsAtCompany = (joiningDate?: string) => {
    if (!joiningDate) { return '-'; }
    const join = new Date(joiningDate);
    const now = new Date();
    const years = now.getFullYear() - join.getFullYear();
    // If join month/day is after now, subtract 1 year
    if (
      now.getMonth() < join.getMonth() ||
      (now.getMonth() === join.getMonth() && now.getDate() < join.getDate())
    ) {
      return years - 1;
    }
    return years;
  };
const { id: resourceId } = useParams();
  const { toast } = useToast();
  const [resourceData, setResourceData] = useState<ResourceData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableResourceData, setEditableResourceData] = useState<ResourceData | null>(null);
  const [isResigned, setIsResigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const response = await getResource(token, resourceId!) as ResourceData | { resource?: ResourceData, resourceDetails?: ResourceData };
        let data: ResourceData | undefined = undefined;
        if (response && (response as any).resource) {
          data = (response as any).resource as ResourceData;
        } else if (response && (response as any).resourceDetails) {
          data = (response as any).resourceDetails as ResourceData;
        } else {
          data = response as ResourceData;
        }
        if (data) {
          data.skills = Array.isArray(data.skills) ? data.skills : [];
          data.primarySkills = Array.isArray((data as any).primarySkills) ? (data as any).primarySkills : [];
          data.currentProjects = Array.isArray(data.currentProjects) ? data.currentProjects : [];
          data.upcomingEngagements = Array.isArray(data.upcomingEngagements) ? data.upcomingEngagements : [];

          // Fetch upcoming engagements from backend and merge
          try {
            const upcoming = await getUpcomingReleases(token);
            let engagements: any[] = [];
            if (Array.isArray(upcoming)) {
              // If API returns array of engagements, filter by resourceId
              engagements = upcoming.filter((e: any) => e.resourceId === data.resourceId);
            } else if (
              upcoming &&
              typeof upcoming === 'object' &&
              'engagements' in upcoming &&
              Array.isArray((upcoming as any).engagements)
            ) {
              // If API returns { engagements: [...] }
              engagements = (upcoming as any).engagements.filter((e: any) => e.resourceId === data.resourceId);
            }
            data.upcomingEngagements = engagements;
          } catch (e) {
            // Ignore error, fallback to resourceData
          }

          setResourceData(data);
          setEditableResourceData(data);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch resource');
      } finally {
        setLoading(false);
      }
    };
    const fetchProjects = async () => {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const result = await getProjects(token, { resourceId }) as { projects?: any[] } | any[];
        if (Array.isArray(result)) {
          setProjects(result);
        } else if (result && Array.isArray(result.projects)) {
          setProjects(result.projects);
        } else {
          setProjects([]);
        }
      } catch (err: any) {
        setProjectsError(err?.message || 'Failed to fetch projects');
      } finally {
        setProjectsLoading(false);
      }
    };
    if (resourceId) {
      fetchResource();
      fetchProjects();
    }
  }, [resourceId]);

  const getInitials = (name: string = '') => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const handleEditResource = () => setIsEditing(true);
  const handleSaveResource = (updatedResource: ResourceData) => {
    setEditableResourceData(updatedResource);
    setIsEditing(false);
  };
  const handleCancelEdit = () => setIsEditing(false);
  // ...existing logic above...
  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />

      {/* Top Summary Section */}
      <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {/* If you have an avatar field, use <img src={resourceData?.avatarUrl} ... /> */}
            <span className="text-3xl font-bold text-gray-600">
              {getInitials(resourceData?.fullName)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{resourceData?.fullName}</h1>
            <p className="text-lg text-gray-600">{resourceData?.designation}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Building className="h-4 w-4" />
                {resourceData?.department}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {resourceData?.location}
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
          onClick={handleEditResource}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Resource
        </Button>
      </div>

      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <span className="text-lg font-semibold text-blue-900">Experience</span>
            <span className="text-2xl font-bold text-blue-900">{resourceData?.experience || '-'}</span>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <span className="text-lg font-semibold text-yellow-900">Years at Company</span>
            <span className="text-2xl font-bold text-yellow-900">{getYearsAtCompany(resourceData?.joiningDate)}</span>
          </CardContent>
        </Card>
        <Card className="bg-purple-50">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <span className="text-lg font-semibold text-purple-900">Current Projects</span>
            <span className="text-2xl font-bold text-purple-900">{projects?.length || 0}</span>
          </CardContent>
        </Card>
        <Card className="bg-orange-50">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <span className="text-lg font-semibold text-orange-900">Billable Status</span>
            <span className="text-2xl font-bold text-orange-900">{resourceData?.billableStatus ? 'Billable' : 'Non-Billable'}</span>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ...existing stats cards... */}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Contact Information Card - Modern UX */}
          <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="font-bold text-base text-gray-800">Contact Information</span>
            </div>
          </CardHeader>
            <CardContent className="space-y-3 px-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Email:</span>
                <span className="text-gray-700">{resourceData?.email || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-green-500" />
                <span className="font-medium">Phone:</span>
                <span className="text-gray-700">{resourceData?.phone || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Location:</span>
                <span className="text-gray-700">{resourceData?.location || '-'}</span>
              </div>
            </CardContent>
          </Card>

          {/* HR Details Card - Modern UX */}
          <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-gray-500" />
              <span className="font-bold text-base text-gray-800">HR Details</span>
            </div>
          </CardHeader>
            <CardContent className="space-y-3 px-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Resource ID:</span>
                <span className="text-gray-700">{resourceData?.resourceId || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Joining Date:</span>
                <span className="text-gray-700">{resourceData?.joiningDate || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Employment Type:</span>
                <span className="px-2 py-1 rounded bg-gray-100 text-xs font-semibold">{resourceData?.employmentType || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Seniority Level:</span>
                <span className="text-gray-700">{resourceData?.seniorityLevel || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Reporting Manager:</span>
                <span className="text-gray-700">{resourceData?.reportingManager || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Cost Center:</span>
                <span className="text-gray-700">{resourceData?.costCenter || '-'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Expertise Card - Modern UX */}
          <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-gray-500" />
              <span className="font-bold text-base text-gray-800">Skills & Expertise</span>
            </div>
          </CardHeader>
            <CardContent className="space-y-3 px-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Primary Skills:</span>
                <span className="text-gray-700">{resourceData?.primarySkills?.join(', ') || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Skill Category:</span>
                <span className="text-gray-700">{resourceData?.skills?.join(', ') || '-'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Current Projects (from backend) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Current Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectsLoading && <div>Loading projects...</div>}
                {projectsError && <div className="text-red-500">{projectsError}</div>}
                {!projectsLoading && !projectsError && projects.length === 0 && (
                  <div>No current projects assigned.</div>
                )}
                {!projectsLoading && !projectsError && projects.map((project, index) => (
                  <div key={project.id || index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{project.name}</h4>
                      <Badge variant="default" className="bg-green-600">
                        {project.healthStatus || 'On Track'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{project.customer}</p>
                    <p className="text-sm text-gray-600">{project.category}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Started</p>
                        <p className="text-sm font-medium">{project.start_date || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="text-sm font-medium">{project.end_date || '-'}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-2" />
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Team Size</p>
                      <p className="text-sm font-medium">{project.teamSize || '-'}</p>
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
            {resourceData?.pastProjectEngagements?.length ? (
              resourceData.pastProjectEngagements.map((engagement, idx) => (
                <div key={idx} className="mb-4 p-3 rounded border bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-700">{engagement.projectName}</span>
                    <Badge variant="outline">{engagement.status}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">{engagement.role}</div>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    <span>Period: {engagement.period}</span>
                    <span>Total Hours: {engagement.totalHours}h</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No past project engagements found.</div>
            )}
              </CardContent>
            </Card>

            {/* Upcoming Engagements (if available from backend, else skip) */}
            {resourceData?.upcomingEngagements && resourceData.upcomingEngagements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Engagements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resourceData.upcomingEngagements.map((engagement, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{engagement.projectName}</h4>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {engagement.status || 'Upcoming'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{engagement.client}</p>
                      <p className="text-sm text-gray-600">{engagement.role}</p>
                      <div className="flex justify-between items-center mt-3">
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="text-sm font-medium">{engagement.period}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
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
}

export default ResourceView;
