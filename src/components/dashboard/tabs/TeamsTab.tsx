
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, Award } from "lucide-react";
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

export const TeamsTab = () => {
  // Sample team data
  const teamComposition = {
    totalMembers: 12,
    activeMembers: 11,
    averageExperience: "4.2 years",
  };

  const teamMembers = [
    { id: "1", name: "Sarah Johnson", role: "Delivery Manager", experience: "8 years", allocation: "100%", status: "Active", performance: "Excellent", department: "Project Management", location: "New York" },
    { id: "2", name: "Mike Chen", role: "Scrum Master", experience: "5 years", allocation: "100%", status: "Active", performance: "Good", department: "Engineering", location: "San Francisco" },
    { id: "3", name: "Alex Rodriguez", role: "Tech Lead", experience: "7 years", allocation: "100%", status: "Active", performance: "Excellent", department: "Engineering", location: "Austin" },
    { id: "4", name: "Emily Davis", role: "Senior Developer", experience: "6 years", allocation: "100%", status: "Active", performance: "Good", department: "Engineering", location: "Remote" },
    { id: "5", name: "James Wilson", role: "Senior Developer", experience: "5 years", allocation: "100%", status: "Active", performance: "Excellent", department: "Engineering", location: "Seattle" },
    { id: "6", name: "Lisa Zhang", role: "Frontend Developer", experience: "4 years", allocation: "80%", status: "Active", performance: "Good", department: "Engineering", location: "Remote" },
    { id: "7", name: "David Kumar", role: "Backend Developer", experience: "3 years", allocation: "100%", status: "Active", performance: "Good", department: "Engineering", location: "Bangalore" },
    { id: "8", name: "Maria Garcia", role: "QA Engineer", experience: "4 years", allocation: "100%", status: "Active", performance: "Excellent", department: "Quality Assurance", location: "Mexico City" },
    { id: "9", name: "Tom Anderson", role: "DevOps Engineer", experience: "6 years", allocation: "60%", status: "Active", performance: "Good", department: "Engineering", location: "London" },
    { id: "10", name: "Rachel Kim", role: "UI/UX Designer", experience: "5 years", allocation: "80%", status: "Active", performance: "Excellent", department: "Design", location: "Seoul" },
    { id: "11", name: "John Smith", role: "Junior Developer", experience: "2 years", allocation: "100%", status: "Active", performance: "Good", department: "Engineering", location: "Toronto" },
    { id: "12", name: "Anna Brown", role: "Business Analyst", experience: "4 years", allocation: "50%", status: "On Leave", performance: "Good", department: "Business Analysis", location: "Sydney" }
  ];

  const roleDistribution = [
    { role: "Developers", count: 6, percentage: 50, color: "bg-blue-500" },
    { role: "QA Engineers", count: 1, percentage: 8, color: "bg-green-500" },
    { role: "DevOps", count: 1, percentage: 8, color: "bg-purple-500" },
    { role: "Management", count: 2, percentage: 17, color: "bg-orange-500" },
    { role: "Design", count: 1, percentage: 8, color: "bg-pink-500" },
    { role: "Business", count: 1, percentage: 8, color: "bg-teal-500" }
  ];

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
      {/* Team Composition KPIs - removed Retention Rate and Satisfaction */}
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
              {Math.round((teamComposition.activeMembers / teamComposition.totalMembers) * 100)}% active
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
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <UserHoverCard
                          name={member.name}
                          role={member.role}
                          department={member.department}
                          location={member.location}
                          email={`${member.name.toLowerCase().replace(/\s+/g, '.')}@company.com`}
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
