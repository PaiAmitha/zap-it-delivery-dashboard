
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultiSelect } from "@/components/ui/multi-select";

interface ResourceManagementFormProps {
  formData: any;
  handleInputChange: (field: string, value: string | string[]) => void;
}

export const ResourceManagementForm = ({ formData, handleInputChange }: ResourceManagementFormProps) => {
  const primarySkillOptions = [
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Management Section</CardTitle>
        <CardDescription>Skills, engagement, and project information</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="primarySkills">Primary Skills *</Label>
                <MultiSelect
                  options={primarySkillOptions}
                  selected={formData.primarySkills || []}
                  onChange={(values) => handleInputChange("primarySkills", values)}
                  placeholder="Select primary skills"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="skillCategory">Skill Category</Label>
                <Select onValueChange={(value) => handleInputChange("skillCategory", value)}>
                  <SelectTrigger>
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
                <Label htmlFor="billableStatus">Billable Status</Label>
                <Select onValueChange={(value) => handleInputChange("billableStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select billable status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Billable</SelectItem>
                    <SelectItem value="false">Non-Billable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentEngagement">Current Engagement</Label>
                <Input
                  id="currentEngagement"
                  value={formData.currentEngagement}
                  onChange={(e) => handleInputChange("currentEngagement", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange("projectName", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="engagementDescription">Engagement Description</Label>
                <Textarea
                  id="engagementDescription"
                  value={formData.engagementDescription}
                  onChange={(e) => handleInputChange("engagementDescription", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="engagementStartDate">Engagement Start Date</Label>
                <Input
                  id="engagementStartDate"
                  type="date"
                  value={formData.engagementStartDate}
                  onChange={(e) => handleInputChange("engagementStartDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="engagementEndDate">Engagement End Date</Label>
                <Input
                  id="engagementEndDate"
                  type="date"
                  value={formData.engagementEndDate}
                  onChange={(e) => handleInputChange("engagementEndDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="agingInNonBillable">Aging in Non-Billable (Days)</Label>
                <Input
                  id="agingInNonBillable"
                  type="number"
                  value={formData.agingInNonBillable}
                  onChange={(e) => handleInputChange("agingInNonBillable", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currentBenchStatus">Current Bench Status</Label>
                <Select onValueChange={(value) => handleInputChange("currentBenchStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bench status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">On Bench</SelectItem>
                    <SelectItem value="false">Engaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="engagementDetail">Engagement Detail</Label>
                <Textarea
                  id="engagementDetail"
                  value={formData.engagementDetail}
                  onChange={(e) => handleInputChange("engagementDetail", e.target.value)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
