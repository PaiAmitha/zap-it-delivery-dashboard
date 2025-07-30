import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Award, Layers, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResource } from "@/lib/api";
import { ResourceData } from "@/types/resource";

const ResourceDetails = () => {
  const { id } = useParams();
  const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resourceId = id;

  useEffect(() => {
    const fetchResourceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        if (resourceId) {
          const resource = await getResource(token, resourceId);
          setSelectedResource(resource as ResourceData);
        } else {
          setSelectedResource(null);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch resource details');
      } finally {
        setLoading(false);
      }
    };
    fetchResourceDetails();
  }, [resourceId]);

  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    if (selectedResource) {
      navigate(`/resource-details/edit/${selectedResource.resourceId}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedResource) return;
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('token') || '';
      await import("@/lib/api").then(api => api.deleteResource(token, selectedResource.resourceId));
      navigate('/resource-management');
    } catch (err: any) {
      alert(err?.message || 'Failed to delete resource');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
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
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4" /> {selectedResource.email ?? "-"}</div>
                  <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4" /> {selectedResource.phone ?? "-"}</div>
                  <div className="flex items-center gap-2 text-gray-700"><MapPin className="w-4 h-4" /> {selectedResource.location ?? "-"}</div>
                </CardContent>
              </Card>
              {/* HR Details */}
              <Card>
                <CardHeader>
                  <CardTitle>HR Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <div><strong>Employee ID:</strong> {selectedResource.employeeId ?? selectedResource.resourceId}</div>
                  <div><strong>Joining Date:</strong> {selectedResource.joiningDate}</div>
                  <div><strong>Employment Type:</strong> {selectedResource.employmentType}</div>
                  <div><strong>Seniority Level:</strong> {selectedResource.seniorityLevel}</div>
                  <div><strong>Reporting Manager:</strong> {selectedResource.reportingManager}</div>
                  <div><strong>Cost Center:</strong> {selectedResource.costCenter}</div>
                </CardContent>
              </Card>
              {/* Skills & Expertise */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <div><strong>Primary Skills:</strong> {selectedResource.primarySkills?.join(", ") ?? "-"}</div>
                  <div><strong>Other Skills:</strong> {selectedResource.skills?.join(", ") ?? "-"}</div>
                </CardContent>
              </Card>
            </div>

            {/* Right/Main Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Current Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedResource.currentProjects && selectedResource.currentProjects.length > 0 ? (
                    selectedResource.currentProjects.map((proj, idx) => (
                      <div key={idx} className="border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                        <div className="flex justify-between items-center">
                          <div>
                        <div className="font-semibold text-gray-800">{proj.name}</div>
                        {/* No role field in currentProjects, so omit for exact match */}
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 font-semibold">
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
                    <div className="text-gray-500">No current projects</div>
                  )}
                </CardContent>
              </Card>
              {/* Past Project Engagements */}
              <Card>
                <CardHeader>
                  <CardTitle>Past Project Engagements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedResource.pastProjectEngagements && selectedResource.pastProjectEngagements.length > 0 ? (
                    selectedResource.pastProjectEngagements.map((eng, idx) => (
                      <div key={idx} className="border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-800">{eng.projectName}</div>
                            <div className="text-xs text-gray-500">{eng.role}</div>
                          </div>
                          <Badge className="bg-green-100 text-green-700 font-semibold">
                            {eng.status ?? "Completed Successfully"}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                          <span>Period: {eng.period ?? "-"}</span>
                          <span>Total Hours: {eng.totalHours ?? "-"}h</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No past project engagements</div>
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
