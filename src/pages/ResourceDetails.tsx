import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Award, Layers, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResource } from "@/lib/api";
import { ResourceData } from "@/types/resource";

const ResourceDetails = () => {
  // Breadcrumb navigation
  const breadcrumb = (
    <nav className="mb-6 flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
      <span className="hover:underline cursor-pointer text-blue-600" onClick={() => navigate('/dashboard')}>Dashboard</span>
      <span className="mx-2">&gt;</span>
      <span className="hover:underline cursor-pointer text-blue-600" onClick={() => navigate('/resource-management')}>Resource Management</span>
      <span className="mx-2">&gt;</span>
      <span className="text-gray-700 font-semibold">Resource Details</span>
    </nav>
  );
  const { employeeId } = useParams();
  const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId || employeeId === 'undefined') {
      setSelectedResource(null);
      setLoading(false);
      setError('No valid employee selected. Please go back and choose a resource with a valid Employee ID.');
      return;
    }
    const fetchResourceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const response = await getResource(token, employeeId);
        setSelectedResource((response as any)?.resource || null);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch resource details');
      } finally {
        setLoading(false);
      }
    };
    fetchResourceDetails();
  }, [employeeId]);

  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    if (selectedResource) {
      navigate(`/resource-details/edit/${selectedResource.employeeId}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedResource) return;
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('token') || '';
      await import("@/lib/api").then(api => api.deleteResource(token, selectedResource.employeeId));
      navigate('/resource-management');
    } catch (err: any) {
      alert(err?.message || 'Failed to delete resource');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {breadcrumb}
      {loading && (
        <Card className="mx-1 sm:mx-0">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Loading resource...</p>
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
      {!loading && !error && selectedResource && (
        <div>
          {/* Header Section - Enhanced Card UX */}
          <Card className="mb-6 bg-gradient-to-br from-gray-50 via-blue-50 to-white border border-blue-100 shadow-md">
            <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-8 px-10">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold shadow">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{selectedResource.fullName}</div>
                  <div className="text-gray-600 text-lg font-medium mb-2">{selectedResource.designation}</div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-700 items-center">
                    <span className="flex items-center gap-1"><Layers className="w-4 h-4" />{selectedResource.department}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{selectedResource.location}</span>
                    <Badge className={`ml-2 px-2 py-1 text-xs font-semibold ${selectedResource.billableStatus ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{selectedResource.billableStatus ? 'Active' : 'Inactive'}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold text-sm shadow" onClick={handleEdit}>Edit</button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold text-sm shadow" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</button>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-blue-50 border border-blue-100 shadow-none">
              <CardContent className="flex flex-col items-start py-4 px-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-blue-100 rounded-full p-2 flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-2xl font-bold text-blue-700">{selectedResource.experience} Years</span>
                </div>
                <div className="text-xs text-gray-600 font-medium mt-1">Experience</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50">
              <CardContent className="flex flex-col items-center py-4">
                <Calendar className="w-6 h-6 text-yellow-600 mb-1" />
                <div className="text-lg font-bold">{selectedResource.yearsAtCompany ?? "-"}</div>
                <div className="text-xs text-gray-500">Years at Company</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardContent className="flex flex-col items-center py-4">
                <Briefcase className="w-6 h-6 text-purple-600 mb-1" />
                <div className="text-lg font-bold">{selectedResource.currentProjects?.length ?? 0}</div>
                <div className="text-xs text-gray-500">Current Projects</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50">
              <CardContent className="flex flex-col items-center py-4">
                <Badge className="bg-orange-500 text-white px-2 py-1 rounded">
                  {selectedResource.billableStatus ? "Billable" : "Non-Billable"}
                </Badge>
                <div className="text-xs text-gray-500 mt-1">Billable Status</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-1">
              {/* Contact Information - Modern Card */}
              <Card className="bg-white/90 border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-lg font-semibold text-gray-900">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4 text-blue-400" /> <span className="font-medium">{selectedResource.email ?? "-"}</span></div>
                  <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4 text-green-400" /> <span className="font-medium">{selectedResource.phone ?? "-"}</span></div>
                  <div className="flex items-center gap-2 text-gray-700"><MapPin className="w-4 h-4 text-purple-400" /> <span className="font-medium">{selectedResource.location ?? "-"}</span></div>
                </CardContent>
              </Card>
              {/* HR Details - Modern Card */}
              <Card className="bg-white/90 border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  <CardTitle className="text-lg font-semibold text-gray-900">HR Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-4 text-sm">
                  <div className="flex justify-between"><span className="font-semibold text-gray-700">Employee ID:</span> <span>{selectedResource.employeeId}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-gray-700">Joining Date:</span> <span>{selectedResource.joiningDate}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-gray-700">Employment Type:</span> <span>{selectedResource.employmentType}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-gray-700">Seniority Level:</span> <span>{selectedResource.seniorityLevel}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-gray-700">Reporting Manager:</span> <span>{selectedResource.reportingManager}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-gray-700">Cost Center:</span> <span>{selectedResource.costCenter}</span></div>
                </CardContent>
              </Card>
              {/* Skills & Expertise - Modern Card */}
              <Card className="bg-white/90 border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <CardTitle className="text-lg font-semibold text-gray-900">Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-4 text-sm">
                  <div className="mb-1"><span className="font-semibold text-gray-700">Primary Skills:</span></div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedResource.primarySkills?.length ? selectedResource.primarySkills.map((skill, idx) => {
                      const cleanSkill = typeof skill === 'string' ? skill.replace(/[{}\[\]"\\]+/g, '').trim() : skill;
                      return <Badge key={idx} className="bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded">{cleanSkill}</Badge>;
                    }) : <span className="text-gray-400">-</span>}
                  </div>
                  <div className="mb-1"><span className="font-semibold text-gray-700">Other Skills:</span></div>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.skills?.length ? selectedResource.skills.map((skill, idx) => {
                      const cleanSkill = typeof skill === 'string' ? skill.replace(/[{}\[\]"\\]+/g, '').trim() : skill;
                      return <Badge key={idx} className="bg-gray-100 text-gray-700 font-medium px-2 py-1 rounded">{cleanSkill}</Badge>;
                    }) : <span className="text-gray-400">-</span>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right/Main Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Current Projects - Modern Card */}
              <Card className="bg-white/90 border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-lg font-semibold text-gray-900">Current Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {selectedResource.currentProjects && selectedResource.currentProjects.length > 0 ? (
                    selectedResource.currentProjects.map((proj, idx) => (
                      <div key={idx} className="border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-800 text-base">{proj.name}</div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded">
                            {proj.healthStatus ?? "In Progress"}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                          <span>Start: {proj.start_date ?? "-"}</span>
                          <span>End: {proj.end_date ?? "-"}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded h-2 mt-2">
                          <div className="bg-blue-600 h-2 rounded" style={{ width: `${proj.progress ?? 0}%` }} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Billable Hours: {proj.teamSize ?? "-"}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No current projects</div>
                  )}
                </CardContent>
              </Card>
              {/* Past Project Engagements - Modern Card */}
              <Card className="bg-white/90 border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-red-500" />
                  <CardTitle className="text-lg font-semibold text-gray-900">Past Project Engagements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {selectedResource.pastProjectEngagements && selectedResource.pastProjectEngagements.length > 0 ? (
                    selectedResource.pastProjectEngagements.map((eng, idx) => (
                      <div key={idx} className="border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-800 text-base">{eng.projectName ?? '-'}</div>
                            <div className="text-xs text-gray-500">{eng.role ?? '-'}</div>
                          </div>
                          <Badge className="bg-red-100 text-red-700 font-semibold px-2 py-1 rounded">
                            {eng.status ?? "Completed"}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                          <span>Start: {eng.startDate ?? '-'}</span>
                          <span>End: {eng.endDate ?? '-'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No past project engagements</div>
                  )}
                </CardContent>
              </Card>
              {/* Upcoming Engagements - Modern Card (single instance below Past Project Engagements) */}
              <Card className="bg-white/90 border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow mt-6">
                <CardHeader className="pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-500" />
                  <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Engagements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {selectedResource.upcomingEngagements && selectedResource.upcomingEngagements.length > 0 ? (
                    selectedResource.upcomingEngagements.map((eng, idx) => (
                      <div key={idx} className="border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-800 text-base">{eng.projectName ?? '-'}</div>
                            <div className="text-xs text-gray-500">{eng.role ?? '-'}</div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-700 font-semibold px-2 py-1 rounded">
                            {eng.status ?? "Upcoming"}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                          <span>Start: {eng.startDate ?? '-'}</span>
                          <span>End: {eng.endDate ?? '-'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No upcoming engagements</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetails;
