
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, User, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";

interface ProjectAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectAllocationModal = ({ isOpen, onClose }: ProjectAllocationModalProps) => {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedSeniority, setSelectedSeniority] = useState("");

  // Enhanced sample data with more realistic scenarios
  const availableResources = [
    {
      id: "EMP001",
      name: "John Smith",
      skills: ["React.js", "Node.js", "TypeScript"],
      primarySkill: "React.js",
      experience: "5-7 years",
      seniorityLevel: "Senior (3+ years)",
      availability: "Immediate",
      utilization: 75,
      skillMatch: 95,
      location: "Bangalore",
      currentProject: "E-commerce Platform",
      billingRate: "$85/hr",
      availabilityDate: "2025-01-20"
    },
    {
      id: "EMP002", 
      name: "Priya Sharma",
      skills: ["QA Testing", "Selenium", "API Testing"],
      primarySkill: "QA Testing",
      experience: "3-5 years",
      seniorityLevel: "Senior (3+ years)",
      availability: "2 weeks",
      utilization: 60,
      skillMatch: 88,
      location: "Hyderabad",
      currentProject: "Internal Testing",
      billingRate: "$65/hr",
      availabilityDate: "2025-02-03"
    },
    {
      id: "EMP003",
      name: "David Chen",
      skills: ["Python", "Machine Learning", "Data Analysis"],
      primarySkill: "Python",
      experience: "7-10 years",
      seniorityLevel: "Senior (3+ years)",
      availability: "1 month",
      utilization: 90,
      skillMatch: 92,
      location: "Remote",
      currentProject: "AI Analytics Dashboard",
      billingRate: "$95/hr",
      availabilityDate: "2025-02-15"
    },
    {
      id: "EMP004",
      name: "Sarah Wilson",
      skills: ["React.js", "JavaScript", "CSS"],
      primarySkill: "React.js",
      experience: "2 years",
      seniorityLevel: "Junior (1-3 years)",
      availability: "Immediate",
      utilization: 45,
      skillMatch: 78,
      location: "Mumbai",
      currentProject: "Training Project",
      billingRate: "$45/hr",
      availabilityDate: "2025-01-22"
    }
  ];

  const projects = [
    { id: "project-alpha", name: "Project Alpha - Mobile App", status: "Planning", priority: "High" },
    { id: "project-beta", name: "Project Beta - Web Platform", status: "In Progress", priority: "Medium" },
    { id: "project-gamma", name: "Project Gamma - Data Migration", status: "Planning", priority: "High" }
  ];

  const skillOptions = [
    { label: "React.js", value: "React.js" },
    { label: "Node.js", value: "Node.js" },
    { label: "Python", value: "Python" },
    { label: "QA Testing", value: "QA Testing" },
    { label: "DevOps", value: "DevOps" },
    { label: "Mobile Development", value: "Mobile Development" },
    { label: "Machine Learning", value: "Machine Learning" },
    { label: "TypeScript", value: "TypeScript" },
    { label: "JavaScript", value: "JavaScript" },
    { label: "Data Analysis", value: "Data Analysis" }
  ];

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getAvailabilityIcon = (availability: string) => {
    if (availability === "Immediate") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (availability.includes("week")) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const handleAllocateResource = (resource: any) => {
    if (!selectedProject) {
      toast({
        title: "Please Select Project",
        description: "You must select a project before allocating resources.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Resource Allocated Successfully",
      description: `${resource.name} has been allocated to the selected project.`,
    });

    console.log("Resource allocated:", {
      resource: resource.id,
      project: selectedProject,
      allocationDate: new Date().toISOString()
    });
  };

  // Filter resources based on selected criteria
  const filteredResources = availableResources.filter(resource => {
    const matchesSeniority = !selectedSeniority || resource.seniorityLevel === selectedSeniority;
    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => resource.skills.includes(skill));
    
    return matchesSeniority && matchesSkills;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Target className="h-6 w-6 text-blue-500" />
            Smart Project Allocation System
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            AI-powered resource allocation based on skills, availability, and project requirements
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enhanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Target Project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant={project.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                        {project.priority}
                      </Badge>
                      {project.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div>
              <MultiSelect
                options={skillOptions}
                selected={selectedSkills}
                onChange={setSelectedSkills}
                placeholder="Required Skill Set"
                className="bg-white"
              />
            </div>
            
            <Select value={selectedSeniority} onValueChange={setSelectedSeniority}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Seniority Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-levels">All Levels</SelectItem>
                <SelectItem value="Junior (1-3 years)">Junior (1–3 years)</SelectItem>
                <SelectItem value="Senior (3+ years)">Senior (3+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Project Overview */}
          {selectedProject && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Selected Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Project Name</p>
                    <p className="text-blue-900">{projects.find(p => p.id === selectedProject)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Status</p>
                    <Badge variant="outline" className="text-blue-800 border-blue-300">
                      {projects.find(p => p.id === selectedProject)?.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Priority</p>
                    <Badge variant={projects.find(p => p.id === selectedProject)?.priority === "High" ? "destructive" : "secondary"}>
                      {projects.find(p => p.id === selectedProject)?.priority}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Resources */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Best-Fit Resources</h3>
              <Badge variant="outline" className="text-sm">
                {filteredResources.length} resources available
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-600" />
                        <div>
                          <CardTitle className="text-base">{resource.name}</CardTitle>
                          <p className="text-sm text-gray-500">{resource.id}</p>
                        </div>
                      </div>
                      <Badge className={getMatchColor(resource.skillMatch)}>
                        {resource.skillMatch}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Primary Skill</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-medium">
                          {resource.primarySkill}
                        </Badge>
                        <span className="text-xs text-gray-500">({resource.experience})</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Seniority</p>
                      <Badge variant="secondary" className="text-xs">
                        {resource.seniorityLevel}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">All Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {resource.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Availability</p>
                        <div className="flex items-center gap-1">
                          {getAvailabilityIcon(resource.availability)}
                          <span className="font-medium">{resource.availability}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Utilization</p>
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${resource.utilization > 80 ? 'bg-red-500' : resource.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${resource.utilization}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{resource.utilization}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-medium">{resource.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Billing Rate</p>
                        <p className="font-medium text-green-600">{resource.billingRate}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600 mb-2">Current: {resource.currentProject}</p>
                      <p className="text-xs text-gray-600 mb-3">Available from: {resource.availabilityDate}</p>
                      <Button 
                        size="sm" 
                        className="w-full bg-blue-500 hover:bg-blue-600 transition-colors"
                        onClick={() => handleAllocateResource(resource)}
                      >
                        Allocate to Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="px-6">
            Close
          </Button>
          <Button className="px-6 bg-blue-500 hover:bg-blue-600">
            Save Allocations
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
