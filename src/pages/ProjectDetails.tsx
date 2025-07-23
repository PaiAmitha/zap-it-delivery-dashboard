import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Calendar, Target, TrendingUp, AlertTriangle, CheckCircle, FileText, Plus, Edit } from "lucide-react";
import { TeamsTab } from "@/components/dashboard/tabs/TeamsTab";
import { DevelopmentTab } from "@/components/dashboard/tabs/DevelopmentTab";
import { QATab } from "@/components/dashboard/tabs/QATab";
import { AddSprintDataModal } from "@/components/dashboard/AddSprintDataModal";
import { EditProjectModal } from "@/components/dashboard/EditProjectModal";
import { DeliveryMetricsFilter } from "@/components/dashboard/DeliveryMetricsFilter";
import { TeamMemberCard } from "@/components/dashboard/TeamMemberCard";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isAddSprintModalOpen, setIsAddSprintModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [selectedDeliveryFilter, setSelectedDeliveryFilter] = useState("average");

  // Enhanced project data from dummy JSON
  const projectData = {
    "1": {
      name: "E-Commerce Platform",
      customer: "TechCorp",
      status: "On Track",
      progress: 65,
      description: "Customer engagement platform",
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      teamSize: 8,
      currentStage: "Development",
      healthStatus: "Green",
      onTimePercentage: 85
    },
    "2": {
      name: "Customer Integration",
      customer: "Zenmate",
      status: "At Risk",
      progress: 45,
      description: "Backend services integration",
      startDate: "2024-02-01",
      endDate: "2024-07-15",
      teamSize: 6,
      currentStage: "Testing",
      healthStatus: "Amber",
      onTimePercentage: 72
    },
    "3": {
      name: "Mobile Banking App",
      customer: "FinanceFirst Bank",
      status: "On Track",
      progress: 80,
      description: "Customer payments platform",
      startDate: "2024-01-10",
      endDate: "2024-05-20",
      teamSize: 12,
      currentStage: "UAT",
      healthStatus: "Green",
      onTimePercentage: 92
    },
    "4": {
      name: "Blockchain Analytics",
      customer: "CryptoTech",
      status: "Critical",
      progress: 35,
      description: "Analytics dashboard",
      startDate: "2024-03-01",
      endDate: "2024-08-15",
      teamSize: 10,
      currentStage: "Development",
      healthStatus: "Critical",
      onTimePercentage: 58
    },
    "5": {
      name: "Healthcare Portal",
      customer: "MedLife Systems",
      status: "At Risk",
      progress: 55,
      description: "Community trust portal",
      startDate: "2024-02-15",
      endDate: "2024-07-30",
      teamSize: 15,
      currentStage: "Testing",
      healthStatus: "Amber",
      onTimePercentage: 68
    },
    "6": {
      name: "IoT Dashboard",
      customer: "SmartHome Inc",
      status: "On Track",
      progress: 70,
      description: "Customer control platform",
      startDate: "2024-01-20",
      endDate: "2024-06-10",
      teamSize: 7,
      currentStage: "Development",
      healthStatus: "Green",
      onTimePercentage: 88
    }
  };

  const project = projectData[projectId as keyof typeof projectData];

  // Enhanced team members with additional info
  const teamMembers = [
    { 
      name: "Sarah Johnson", 
      role: "Delivery Manager", 
      allocation: "100%", 
      status: "Active",
      email: "sarah.johnson@company.com",
      department: "Project Management",
      location: "New York"
    },
    { 
      name: "Mike Chen", 
      role: "Scrum Master", 
      allocation: "100%", 
      status: "Active",
      email: "mike.chen@company.com",
      department: "Engineering",
      location: "San Francisco"
    },
    { 
      name: "Alex Rodriguez", 
      role: "Tech Lead", 
      allocation: "100%", 
      status: "Active",
      email: "alex.rodriguez@company.com",
      department: "Engineering",
      location: "Austin"
    },
    { 
      name: "Emily Davis", 
      role: "Senior Developer", 
      allocation: "100%", 
      status: "Active",
      email: "emily.davis@company.com",
      department: "Engineering",
      location: "Remote"
    },
    { 
      name: "James Wilson", 
      role: "Senior Developer", 
      allocation: "100%", 
      status: "Active",
      email: "james.wilson@company.com",
      department: "Engineering",
      location: "Seattle"
    }
  ];

  // Sprint-wise delivery metrics data
  const sprintMetricsData = {
    'sprint-1': { sprintVelocity: 35, predictability: 82, defectLeakage: 5, onTimeDelivery: 85 },
    'sprint-2': { sprintVelocity: 38, predictability: 85, defectLeakage: 4, onTimeDelivery: 88 },
    'sprint-3': { sprintVelocity: 41, predictability: 87, defectLeakage: 3, onTimeDelivery: 90 },
    'sprint-4': { sprintVelocity: 43, predictability: 89, defectLeakage: 2, onTimeDelivery: 93 },
    'sprint-5': { sprintVelocity: 45, predictability: 91, defectLeakage: 1, onTimeDelivery: 95 },
    'average': { sprintVelocity: 42, predictability: 87, defectLeakage: 3, onTimeDelivery: 92 }
  };

  // Get current delivery metrics based on selected filter
  const getCurrentDeliveryMetrics = () => {
    return sprintMetricsData[selectedDeliveryFilter as keyof typeof sprintMetricsData] || sprintMetricsData.average;
  };

  const deliveryMetrics = getCurrentDeliveryMetrics();

  // Milestone Status
  const milestones = [
    { name: "MVP Release", progress: 100, status: "completed", date: "3/15/2024" },
    { name: "Beta Testing", progress: 75, status: "on track", date: "4/30/2024" },
    { name: "User Acceptance", progress: 45, status: "on track", date: "5/15/2024" },
    { name: "Production Release", progress: 20, status: "at risk", date: "6/30/2024" }
  ];

  // Risk Register
  const risks = [
    { issue: "Third-party API dependency", owner: "Tech Lead", priority: "high", status: "Active" },
    { issue: "Resource availability", owner: "Delivery Manager", priority: "medium", status: "Mitigated" },
    { issue: "Client approval delays", owner: "CSP", priority: "low", status: "Monitoring" }
  ];

  // Engineering Metrics
  const engineeringMetrics = {
    codeCoverage: 84,
    performanceScore: 94,
    teamComposition: {
      totalMembers: 12,
      retentionRate: 89,
      satisfactionScore: 93
    }
  };

  if (!project) {
    return (
      <div className="space-y-6">
        <BreadcrumbNavigation />
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Project Not Found</h2>
          <p className="text-gray-600 mt-2">The requested project could not be found.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on track': return 'bg-blue-100 text-blue-800';
      case 'at risk': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'on track': return 'secondary';
      case 'at risk': return 'outline';
      case 'delayed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsAddSprintModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Sprint
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsEditProjectModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Metrics</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="engineering">Engineering Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Project Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project.customer}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project.progress}%</div>
                <Progress value={project.progress} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project.teamSize}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On-Time %</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project.onTimePercentage}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Key Team Members with hover cards */}
          <Card>
            <CardHeader>
              <CardTitle>Key Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <TeamMemberCard member={member}>
                          <span className="cursor-pointer hover:text-blue-600 transition-colors">
                            {member.name}
                          </span>
                        </TeamMemberCard>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.allocation}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{member.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">{project.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium">{project.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Stage:</span>
                <span className="font-medium">{project.currentStage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Health Status:</span>
                <Badge className="bg-green-100 text-green-800">{project.healthStatus}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          {/* Delivery Metrics Filter */}
          <DeliveryMetricsFilter
            selectedFilter={selectedDeliveryFilter}
            onFilterChange={setSelectedDeliveryFilter}
            totalSprints={15}
          />

          {/* Delivery KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sprint Velocity</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveryMetrics.sprintVelocity}</div>
                <p className="text-xs text-muted-foreground">Story points</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Predictability</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveryMetrics.predictability}%</div>
                <p className="text-xs text-muted-foreground">Sprint commitment</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Defect Leakage</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveryMetrics.defectLeakage}</div>
                <p className="text-xs text-muted-foreground">Production defects</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveryMetrics.onTimeDelivery}%</div>
                <p className="text-xs text-muted-foreground">Sprint goals met</p>
              </CardContent>
            </Card>
          </div>

          {/* Milestone Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Milestone Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{milestone.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={getBadgeVariant(milestone.status)}>
                          {milestone.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{milestone.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={milestone.progress} className="flex-1" />
                      <span className="text-sm font-medium">{milestone.progress}% complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Register */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Register
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {risks.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{risk.issue}</p>
                      <p className="text-xs text-gray-500">Owner: {risk.owner}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(risk.priority)} variant="outline">
                        {risk.priority}
                      </Badge>
                      <Badge className={getStatusColor(risk.status)} variant="outline">
                        {risk.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <TeamsTab />
        </TabsContent>

        <TabsContent value="engineering" className="space-y-6">
          <Tabs defaultValue="development" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="qa">QA</TabsTrigger>
            </TabsList>

            <TabsContent value="development">
              <DevelopmentTab />
            </TabsContent>

            <TabsContent value="qa">
              <QATab />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddSprintDataModal 
        isOpen={isAddSprintModalOpen}
        onClose={() => setIsAddSprintModalOpen(false)}
        projectName={project.name}
      />
      <EditProjectModal 
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        projectData={project}
      />
    </div>
  );
};

export default ProjectDetails;
