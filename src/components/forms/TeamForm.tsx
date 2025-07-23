
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMembersSection } from "@/components/dashboard/modal/TeamMembersSection";

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

interface TeamFormProps {
  formData: any;
  setFormData: (data: any) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
}

export const TeamForm = ({ formData, setFormData, teamMembers, setTeamMembers }: TeamFormProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                type="number"
                value={formData.teamSize}
                onChange={(e) => setFormData({...formData, teamSize: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="retentionRate">Retention Rate (%)</Label>
              <Input
                id="retentionRate"
                type="number"
                min="0"
                max="100"
                value={formData.retentionRate}
                onChange={(e) => setFormData({...formData, retentionRate: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="satisfactionScore">Satisfaction Score</Label>
              <Input
                id="satisfactionScore"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.satisfactionScore}
                onChange={(e) => setFormData({...formData, satisfactionScore: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="trainingHours">Training Hours</Label>
              <Input
                id="trainingHours"
                type="number"
                value={formData.trainingHours}
                onChange={(e) => setFormData({...formData, trainingHours: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="utilization">Current Utilization (%)</Label>
              <Input
                id="utilization"
                type="number"
                min="0"
                max="100"
                value={formData.utilization}
                onChange={(e) => setFormData({...formData, utilization: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <TeamMembersSection
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        showOnlyKeyMembers={false}
      />
    </div>
  );
};
