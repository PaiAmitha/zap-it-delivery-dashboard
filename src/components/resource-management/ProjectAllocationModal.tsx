import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, User } from 'lucide-react';
import { getProjects, getResources, allocateProject } from '@/lib/api';
import { MultiSelect } from '@/components/ui/multi-select';

// If any components are missing, add placeholders below:
// Remove these if you have real implementations
// Example placeholder:
// export const Dialog = ({ children, ...props }: any) => <div {...props}>{children}</div>;
// export const DialogContent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
// ...repeat for other components as needed
interface ProjectAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Project {
  id: string | number;
  name: string;
  status?: string;
  priority?: string;
  priority_level?: string;
  skills?: string[];
  primarySkills?: string[];
}

interface Resource {
  employeeId?: string;
  id?: string;
  fullName?: string;
  name?: string;
  skills?: string[] | string;
  primarySkills?: string[] | string;
  seniorityLevel?: string;
  status?: string;
  billableStatus?: boolean;
  currentEngagement?: string;
  currentProject?: string;
  projectName?: string;
  location?: string;
}


export const ProjectAllocationModal = ({ isOpen, onClose }: ProjectAllocationModalProps) => {
  // State for selected project, skills, resource, seniority, date, loading, and data
  // UX: Add success state for feedback
  const [success, setSuccess] = React.useState<string | null>(null);
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);
  // Skills to match are always the project's skills
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [selectedResource, setSelectedResource] = React.useState<string | null>(null);
  const [selectedSeniority, setSelectedSeniority] = React.useState<string>('all-levels');
  const [allocationDate, setAllocationDate] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [allResources, setAllResources] = React.useState<Resource[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  // Helper for step indicator (must be after state declarations)
  const steps = [
    { label: 'Select Project', complete: !!selectedProject },
    { label: 'Select Resource', complete: !!selectedResource },
    { label: 'Set Start Date', complete: !!allocationDate },
    { label: 'Allocate', complete: !!success },
  ];
  // Fetch projects and resources on open
  React.useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const token = localStorage.getItem('token') || '';
    Promise.all([
      getProjects(token),
      getResources(token)
    ]).then(([projData, resData]) => {
      // Type assertions to fix 'unknown' errors
      const projectsList = Array.isArray(projData)
        ? projData as Project[]
        : ((projData as { projects?: Project[] })?.projects || []);
      const resourcesList = Array.isArray(resData)
        ? resData as Resource[]
        : ((resData as { resources?: Resource[] })?.resources || []);
      setProjects(projectsList);
      setAllResources(resourcesList);
      setLoading(false);
    }).catch((err) => {
      setError('Failed to load data');
      setLoading(false);
    });
  }, [isOpen]);

  // Get skills for selected project
  const projectSkills = React.useMemo(() => {
    if (!selectedProject) return [];
    const project = projects.find(p => String(p.id) === selectedProject);
    return project?.skills?.length ? project.skills : (project?.primarySkills || []);
  }, [projects, selectedProject]);

  // Always update selectedSkills when project changes
  React.useEffect(() => {
    setSelectedSkills(projectSkills);
  }, [projectSkills]);

  // Filter resources by selected skills and seniority
  // Only show resources after project is selected
  const filteredResources = React.useMemo(() => {
    if (!selectedProject) return [];
    // Use projectSkills for matching
    return allResources
      .map(resource => {
        const resourceSkills = Array.isArray(resource.skills) ? resource.skills : (resource.skills ? [resource.skills] : []);
        const matchCount = projectSkills.filter(skill => resourceSkills.includes(skill)).length;
        const matchPercent = projectSkills.length > 0 ? Math.round((matchCount / projectSkills.length) * 100) : 0;
        return {
          ...resource,
          matchPercent,
        };
      })
      .filter(resource => {
        // Only show resources with at least one skill match
        const seniorityMatch = selectedSeniority === 'all-levels' || resource.seniorityLevel === selectedSeniority;
        return resource.matchPercent > 0 && seniorityMatch;
      })
      .sort((a, b) => b.matchPercent - a.matchPercent); // Sort by best match
  }, [allResources, selectedProject, projectSkills, selectedSeniority]);

  // Handler for allocating resource (real backend)
  const handleAllocateResource = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('token') || '';
      await allocateProject(token, {
        project_id: selectedProject,
        resource_id: selectedResource,
        start_date: allocationDate,
        skills: selectedSkills,
        seniority: selectedSeniority
      });

      // Update resource status and current project locally
      setAllResources(prev => prev.map(r => {
        if (String(r.employeeId || r.id) === String(selectedResource)) {
          return {
            ...r,
            status: 'Allocated',
            currentProject: selectedProject,
            currentEngagement: selectedProject,
          };
        }
        return r;
      }));

      // Optionally, refresh project team members and resource details
      // (Assume getProjects and getResources will fetch updated data)
      const [updatedProjects, updatedResources] = await Promise.all([
        getProjects(token),
        getResources(token)
      ]);
      const projectsList = Array.isArray(updatedProjects)
        ? updatedProjects as Project[]
        : ((updatedProjects as { projects?: Project[] })?.projects || []);
      const resourcesList = Array.isArray(updatedResources)
        ? updatedResources as Resource[]
        : ((updatedResources as { resources?: Resource[] })?.resources || []);
      setProjects(projectsList);
      setAllResources(resourcesList);

      setLoading(false);
      setSuccess('Resource allocated successfully!');
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      setError('Failed to allocate resource');
      setLoading(false);
    }
  };
  // ...existing logic...
  // All hooks, state, and logic are inside the function
  // Return statement appears only once, with all JSX tags properly closed
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa]">
        <div
          className="flex flex-col gap-2 w-full h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
        >
          <DialogHeader className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-gray-100">
            <DialogTitle className="flex items-center gap-3 text-2xl sm:text-3xl font-extrabold text-blue-700">
              <Target className="h-8 w-8 text-teal-500" />
              Project Resource Allocation
            </DialogTitle>
            <div className="text-sm text-gray-500 mt-1">Assign resources to projects with smart matching and instant feedback.</div>
            {/* Step indicator */}
            <div className="flex flex-wrap gap-2 mt-4 mb-2" aria-label="Progress steps">
              {steps.map((step, idx) => (
                <div key={step.label} className="flex items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step.complete ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-400 border-gray-300'}`}>{idx + 1}</div>
                  <span className={`text-xs font-medium ${step.complete ? 'text-blue-700' : 'text-gray-400'}`}>{step.label}</span>
                  {idx < steps.length - 1 && <span className="mx-1 text-gray-300">→</span>}
                </div>
              ))}
            </div>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-8 px-4 sm:px-8 pb-8 w-full">
            {/* Left: Allocation Details */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 flex flex-col gap-8 border border-gray-100 w-full md:w-1/2 min-w-0">
              <h2 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" /> Allocation Details
              </h2>
              <div className="flex flex-col gap-5">
                <div className="border-b border-dashed border-gray-200 pb-4 mb-4">
                  <label className="block text-sm font-semibold text-blue-700 mb-1 flex items-center gap-1">
                    Select Project *
                    <span className="text-gray-400" title="Choose a project to allocate resources">ⓘ</span>
                  </label>
                  <Select value={selectedProject ?? ''} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-base shadow-sm">
                      <SelectValue placeholder="Choose project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={String(project.id)}>
                          <span className="font-semibold text-blue-700">{project.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Show project skills as chips */}
                  {projectSkills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {projectSkills.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
            {/* Seniority filter, only show after project is selected */}
            {selectedProject && (
              <div className="border-b border-dashed border-gray-200 pb-4 mb-4">
                <label className="block text-sm font-semibold text-blue-700 mb-1 flex items-center gap-1">
                  Filter by Seniority
                  <span className="text-gray-400" title="Filter resources by seniority">ⓘ</span>
                </label>
                <Select value={selectedSeniority} onValueChange={setSelectedSeniority}>
                  <SelectTrigger className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-base shadow-sm">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-levels">All levels</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Resource select, only show after project is selected */}
            {selectedProject && (
              <div className="border-b border-dashed border-gray-200 pb-4 mb-4">
                <label className="block text-sm font-semibold text-blue-700 mb-1 flex items-center gap-1">
                  Select Resource *
                  <span className="text-gray-400" title="Choose a resource to allocate">ⓘ</span>
                </label>
                <Select value={selectedResource ?? ''} onValueChange={setSelectedResource}>
                  <SelectTrigger className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-base shadow-sm">
                    <SelectValue placeholder={filteredResources.length === 0 ? "No matching resources" : "Choose resource"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredResources.map((resource) => (
                      <SelectItem key={resource.employeeId || resource.id} value={String(resource.employeeId || resource.id)}>
                        <span className="font-semibold text-blue-700">{resource.fullName || resource.name}</span>
                        <span className="ml-2 text-xs text-teal-700">{resource.matchPercent}% match</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
                <div className="border-b border-dashed border-gray-200 pb-4 mb-4">
                  <label className="block text-sm font-semibold text-blue-700 mb-1 flex items-center gap-1">
                    Allocation Start Date
                    <span className="text-gray-400" title="Select the start date for allocation">ⓘ</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border border-blue-200 rounded-lg px-3 py-2 text-base shadow-sm"
                    value={allocationDate}
                    onChange={e => setAllocationDate(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 mt-2 items-center justify-end">
                  <Button variant="outline" onClick={onClose} className="px-6 rounded-lg border border-blue-200">Cancel</Button>
                  <Button
                    className="px-6 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold shadow"
                    disabled={loading || !selectedProject || !selectedResource || !allocationDate}
                    onClick={handleAllocateResource}
                  >
                    {loading ? 'Allocating...' : 'Allocate Resource'}
                  </Button>
                </div>
                {(error || success) && (
                  <div className="mt-2">
                    {error && <div className="text-red-500 text-sm px-4">{error}</div>}
                    {success && <div className="text-green-600 text-sm px-4 font-semibold">{success}</div>}
                  </div>
                )}
              </div>
            </div>
            {/* Right: Smart Resource Matching */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 flex flex-col gap-8 border border-gray-100 w-full md:w-1/2 min-w-0">
              <h2 className="text-xl font-bold text-teal-700 mb-2 flex items-center gap-2">
                <Target className="h-5 w-5 text-teal-400" /> Smart Resource Matching
              </h2>
              <div className="flex flex-col gap-5">
                {!selectedProject && (
                  <div className="text-gray-400 text-sm">Select a project to view matching resources.</div>
                )}
                {selectedProject && filteredResources.length === 0 && (
                  <div className="text-gray-400 text-sm">No matching resources found for selected skills and seniority.</div>
                )}
                {selectedProject && filteredResources.map((resource) => (
                  <div key={resource.employeeId || resource.id} className="rounded-xl border border-teal-100 bg-[#f6f8fc] p-4 flex flex-col gap-2 shadow hover:shadow-md transition">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar circle with initials */}
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                          {(resource.fullName || resource.name || '').split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <div className="text-base font-semibold text-blue-700">{resource.fullName || resource.name}</div>
                          <div className="text-xs text-gray-500 font-medium">{resource.seniorityLevel || 'Developer'}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-xs px-2 py-1 rounded ${resource.status === 'Available' ? 'bg-blue-100 text-blue-700' : resource.billableStatus ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {resource.status === 'Available' ? 'Benched' : resource.billableStatus ? 'Billable' : 'Associate'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(Array.isArray(resource.skills) ? resource.skills : [resource.skills]).map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs px-2 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-semibold text-teal-700">Match: {resource.matchPercent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
