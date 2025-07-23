
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMembersSection } from "@/components/dashboard/modal/TeamMembersSection";
import { MilestonesSection } from "@/components/dashboard/modal/MilestonesSection";
import { RisksSection } from "@/components/dashboard/modal/RisksSection";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  allocation: number;
  billable: boolean;
  location: string;
  utilization: string;
  status: string;
}

interface Milestone {
  name: string;
  progress: number;
  status: string;
  date: string;
}

interface Risk {
  issue: string;
  owner: string;
  priority: string;
  status: string;
}

interface ProjectOverviewFormProps {
  formData: any;
  setFormData: (data: any) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
  risks: Risk[];
  setRisks: (risks: Risk[]) => void;
}

export const ProjectOverviewForm = ({
  formData,
  setFormData,
  teamMembers,
  setTeamMembers,
  milestones,
  setMilestones,
  risks,
  setRisks
}: ProjectOverviewFormProps) => {
  return (
    <div className="space-y-6">
      {/* Basic Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="projectCategory">Project Category</Label>
              <Select value={formData.projectCategory} onValueChange={(value) => setFormData({...formData, projectCategory: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Project Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="ZapMinds">ZapMinds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Deployment">Deployment</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="health">Health</Label>
              <Select value={formData.health} onValueChange={(value) => setFormData({...formData, health: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="At Risk">At Risk</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="projectType">Project Type</Label>
              <Select value={formData.projectType} onValueChange={(value) => setFormData({...formData, projectType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed Bid">Fixed Bid</SelectItem>
                  <SelectItem value="Time & Materials">Time & Materials</SelectItem>
                  <SelectItem value="Agile">Agile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 24 weeks"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="currentStage">Current Stage</Label>
              <Input
                id="currentStage"
                value={formData.currentStage}
                onChange={(e) => setFormData({...formData, currentStage: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="engineeringManager">Engineering Manager</Label>
              <Select onValueChange={(value) => setFormData({...formData, engineeringManager: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Engineering Manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="mike-chen">Mike Chen</SelectItem>
                  <SelectItem value="alex-rodriguez">Alex Rodriguez</SelectItem>
                  <SelectItem value="emily-davis">Emily Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="projectBudget">Project Budget</Label>
              <Input
                id="projectBudget"
                type="number"
                placeholder="Enter budget amount"
                value={formData.projectBudget}
                onChange={(e) => setFormData({...formData, projectBudget: e.target.value})}
              />
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="requiredSkills">Required Skills</Label>
              <Textarea
                id="requiredSkills"
                placeholder="Enter required skills separated by commas (e.g., React, Node.js, Python)"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Enter detailed project description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <TeamMembersSection
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        showOnlyKeyMembers={true}
      />

      <MilestonesSection
        milestones={milestones}
        setMilestones={setMilestones}
      />

      <RisksSection
        risks={risks}
        setRisks={setRisks}
      />
    </div>
  );
};
