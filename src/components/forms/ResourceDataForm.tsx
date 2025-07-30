
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultiSelect } from "@/components/ui/multi-select";

interface ResourceDataFormProps {
  formData: any;
  onChange: (field: string, value: string | string[]) => void;
}

export const ResourceDataForm = ({ formData, onChange }: ResourceDataFormProps) => {
  const handleInputChange = onChange;
  const primarySkills = [
    { label: "React.js", value: "React.js" },
    { label: "Node.js", value: "Node.js" },
    { label: "Python", value: "Python" },
    { label: "Java", value: "Java" },
    { label: "Angular", value: "Angular" },
    { label: "Vue.js", value: "Vue.js" },
    { label: "DevOps", value: "DevOps" },
    { label: "QA Testing", value: "QA Testing" },
    { label: "UI/UX Design", value: "UI/UX Design" },
    { label: "Data Science", value: "Data Science" },
    { label: "Mobile Development", value: "Mobile Development" },
    { label: "Machine Learning", value: "Machine Learning" },
    { label: "Cloud Computing", value: "Cloud Computing" },
    { label: "Cybersecurity", value: "Cybersecurity" },
    { label: "Database Management", value: "Database Management" },
    { label: "Project Management", value: "Project Management" }
  ];

  const skillCategories = [
    "Frontend Development", "Backend Development", "Full Stack Development",
    "Mobile Development", "DevOps & Infrastructure", "Quality Assurance",
    "Data Science & Analytics", "UI/UX Design", "Project Management",
    "Cloud & Infrastructure", "Security", "Database Management"
  ];

  const experienceLevels = [
    "0-1 years", "1-2 years", "2-3 years", "3-5 years", 
    "5-7 years", "7-10 years", "10+ years"
  ];

  const activeProjects = [
    { name: "Project Alpha", description: "E-commerce platform development with React and Node.js" },
    { name: "Project Beta", description: "Mobile application for customer engagement" },
    { name: "Project Gamma", description: "Data analytics dashboard for business intelligence" },
    { name: "Project Delta", description: "Cloud migration and infrastructure optimization" },
    { name: "Project Epsilon", description: "AI-powered recommendation system" },
    { name: "Project Zeta", description: "Security audit and compliance management" },
    { name: "Project Eta", description: "DevOps pipeline automation and deployment" }
  ];

  const handleProjectChange = (projectName: string) => {
    const selectedProject = activeProjects.find(project => project.name === projectName);
    handleInputChange("projectName", projectName);
    if (selectedProject) {
      handleInputChange("projectDescription", selectedProject.description);
    }
  };

  return (
    <Card className="border-green-200 bg-green-50/30">
      <CardHeader>
        <CardTitle className="text-green-900">Resource Details</CardTitle>
        <CardDescription>Technical skills and current engagement information</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-6 pr-4">
            {/* Skills Section */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-4">Technical Skills & Experience</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="primarySkill" className="text-sm font-medium text-gray-700">Primary Skills *</Label>
                  <MultiSelect
                    options={primarySkills}
                    selected={Array.isArray(formData.primarySkills) ? formData.primarySkills : []}
                    onChange={(values) => handleInputChange("primarySkills", values)}
                    placeholder="Select primary skills"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="primarySkillExperience" className="text-sm font-medium text-gray-700">Primary Skill Experience *</Label>
                  <Select onValueChange={(value) => handleInputChange("primarySkillExperience", value)} value={formData.primarySkillExperience}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="skillCategory" className="text-sm font-medium text-gray-700">Skill Category *</Label>
                  <Select onValueChange={(value) => handleInputChange("skillCategory", value)} value={formData.skillCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select skill category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="skillCategoryExperience" className="text-sm font-medium text-gray-700">Category Experience *</Label>
                  <Select onValueChange={(value) => handleInputChange("skillCategoryExperience", value)} value={formData.skillCategoryExperience}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Engagement Section */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-4">Current Engagement</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billableStatus" className="text-sm font-medium text-gray-700">Billable Status *</Label>
                  <Select onValueChange={(value) => handleInputChange("billableStatus", value)} value={formData.billableStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select billable status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Billable">Billable</SelectItem>
                      <SelectItem value="Non-Billable">Non-Billable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currentEngagement" className="text-sm font-medium text-gray-700">Current Engagement</Label>
                  <Select onValueChange={(value) => handleInputChange("currentEngagement", value)} value={formData.currentEngagement}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select engagement type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Client Project">Client Project</SelectItem>
                      <SelectItem value="Internal Project">Internal Project</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Shadow Project">Shadow Project</SelectItem>
                      <SelectItem value="Pre-Sales">Pre-Sales</SelectItem>
                      <SelectItem value="Bench">Bench</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Project Details Section */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-4">Project Information</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">Project Name</Label>
                  <Select onValueChange={handleProjectChange} value={formData.projectName}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeProjects.map((project) => (
                        <SelectItem key={project.name} value={project.name}>{project.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="projectDescription" className="text-sm font-medium text-gray-700">Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                    placeholder="Project description will auto-populate when project is selected"
                    rows={3}
                    className="mt-1"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="engagementStartDate" className="text-sm font-medium text-gray-700">Engagement Start Date</Label>
                    <Input
                      id="engagementStartDate"
                      type="date"
                      value={formData.engagementStartDate}
                      onChange={(e) => handleInputChange("engagementStartDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="engagementEndDate" className="text-sm font-medium text-gray-700">Engagement End Date</Label>
                    <Input
                      id="engagementEndDate"
                      type="date"
                      value={formData.engagementEndDate}
                      onChange={(e) => handleInputChange("engagementEndDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
