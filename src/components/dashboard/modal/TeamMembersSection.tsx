
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { TeamMemberCard } from "@/components/dashboard/TeamMemberCard";
import { UserHoverCard } from "@/components/ui/user-hover-card";

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

interface TeamMembersSectionProps {
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  showOnlyKeyMembers?: boolean;
}

export const TeamMembersSection = ({ 
  teamMembers, 
  setTeamMembers, 
  showOnlyKeyMembers = false 
}: TeamMembersSectionProps) => {
  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: "",
      role: "",
      allocation: 100,
      billable: true,
      location: "",
      utilization: "100%",
      status: "active"
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const updateTeamMember = (id: string, field: string, value: any) => {
    setTeamMembers(
      teamMembers.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const displayMembers = showOnlyKeyMembers ? teamMembers.slice(0, 4) : teamMembers;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {showOnlyKeyMembers ? "Key Team Members" : "Team Members"}
          </CardTitle>
          <Button onClick={addTeamMember} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="relative">
                    <Input
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                    />
                    {member.name && (
                      <div className="absolute inset-0 pointer-events-none">
                        <UserHoverCard
                          name={member.name}
                          role={member.role || "Team Member"}
                          department="Engineering"
                          location={member.location || "Remote"}
                          email={`${member.name.toLowerCase().replace(/\s+/g, '.')}@company.com`}
                        >
                          <div className="absolute inset-0 cursor-pointer pointer-events-auto bg-transparent" />
                        </UserHoverCard>
                      </div>
                    )}
                  </div>
                  <Input
                    placeholder="Role"
                    value={member.role}
                    onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                  />
                  <Input
                    placeholder="Location"
                    value={member.location}
                    onChange={(e) => updateTeamMember(member.id, 'location', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Allocation %"
                    value={member.allocation}
                    onChange={(e) => updateTeamMember(member.id, 'allocation', parseInt(e.target.value))}
                  />
                  <Select
                    value={member.billable.toString()}
                    onValueChange={(value) => updateTeamMember(member.id, 'billable', value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Billable</SelectItem>
                      <SelectItem value="false">Non-Billable</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTeamMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
