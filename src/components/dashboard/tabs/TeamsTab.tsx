import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Award } from "lucide-react";
import { UserHoverCard } from "@/components/ui/user-hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";


export const TeamsTab = ({ teams, teamMembers }: { teams: any, teamMembers: any[] }) => {
  // Map backend resource fields to UI fields
  const mappedMembers = (teamMembers || []).map(m => ({
    id: m.id,
    name: m.full_name || m.name || m.employee_id,
    role: m.designation || m.role || 'Member',
    experience: m.experience,
    allocation: m.engagement_detail || m.allocation || '',
    status: m.status || 'Active',
    performance: m.performance_feedback || m.performance || 'Good',
    department: m.department,
    location: m.location,
    email: m.email,
  }));

  const totalMembers = mappedMembers.length;
  const activeMembers = mappedMembers.filter(m => (m.status || '').toLowerCase() === 'active').length;
  const avgExperience = totalMembers > 0
    ? (mappedMembers.reduce((sum, m) => sum + (parseFloat(m.experience) || 0), 0) / totalMembers).toFixed(1)
    : '-';
  const teamComposition = {
    totalMembers,
    activeMembers,
    averageExperience: avgExperience
  };

  // Compute role distribution from mappedMembers
  let roleDistribution: { role: string; count: number; percentage: number; color: string }[] = [];
  if (mappedMembers.length > 0) {
    const roleCounts: Record<string, number> = {};
    mappedMembers.forEach(member => {
      if (member.role) {
        roleCounts[member.role] = (roleCounts[member.role] || 0) + 1;
      }
    });
    const total = mappedMembers.length;
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-teal-500", "bg-yellow-500"
    ];
    let colorIdx = 0;
    roleDistribution = Object.entries(roleCounts).map(([role, count]) => ({
      role,
      count,
      percentage: Math.round((count / total) * 100),
      color: colors[colorIdx++ % colors.length]
    }));
  }

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Good": return "bg-blue-100 text-blue-800";
      case "Average": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "On Leave": return "bg-orange-100 text-orange-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Composition KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamComposition.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {teamComposition.activeMembers} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Experience</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamComposition.averageExperience}</div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamComposition.activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              {teamComposition.totalMembers > 0 ? Math.round((teamComposition.activeMembers / teamComposition.totalMembers) * 100) : 0}% active
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappedMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <UserHoverCard
                          name={member.name}
                          role={member.role}
                          department={member.department}
                          location={member.location}
                          email={member.email}
                        >
                          <span className="cursor-pointer hover:text-blue-600 transition-colors">
                            {member.name}
                          </span>
                        </UserHoverCard>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.experience}</TableCell>
                      <TableCell>{member.allocation}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(member.status)}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPerformanceBadge(member.performance)}>
                          {member.performance}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        {/* Role Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roleDistribution.map((role, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${role.color}`}></div>
                    <span className="text-sm font-medium">{role.role}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${role.color}`}
                        style={{ width: `${role.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{role.count}</span>
                    <span className="text-sm text-gray-500 w-8">{role.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
