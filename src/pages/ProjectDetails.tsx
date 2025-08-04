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
import { getProjectDetails, getProjectMilestones, getProjectRisks, getProjectTeamMembers, getProjectEngineeringMetrics } from "@/lib/api";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isAddSprintModalOpen, setIsAddSprintModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [selectedDeliveryFilter, setSelectedDeliveryFilter] = useState("average");


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  // Remove old sprintMetricsData state, use computed metrics from sprints
  const [milestones, setMilestones] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [engineeringMetrics, setEngineeringMetrics] = useState<any>(null);

  // Refetch handler for modals
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || '';
      const [projectData, milestonesData, risksData, teamMembersData, engineeringMetricsData, sprintsData] = await Promise.all([
        getProjectDetails(token, projectId),
        getProjectMilestones(token, projectId),
        getProjectRisks(token, projectId),
        getProjectTeamMembers(token, projectId),
        getProjectEngineeringMetrics(token, projectId),
        // Always fetch sprints from backend
        (projectId ? (await import('@/lib/api')).getProjectSprints(token, projectId) : { sprints: [] })
      ]);
      // Merge all related data into the project object
      const mergedProject = {
        ...((projectData as any)?.project || {}),
        milestones: (milestonesData as any)?.milestones || [],
        risks: (risksData as any)?.risks || [],
        teamMembers: (teamMembersData as any)?.teamMembers || [],
        engineeringMetrics: (engineeringMetricsData as any)?.engineeringMetrics || {},
        riskCount: ((risksData as any)?.risks || []).length,
        sprints: (sprintsData as any)?.sprints || []
      };
      setProject(mergedProject);
      setMilestones(mergedProject.milestones);
      setRisks(mergedProject.risks);
      setTeamMembers(mergedProject.teamMembers);
      setEngineeringMetrics(mergedProject.engineeringMetrics);
    } catch (err: any) {
      setError(err?.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (projectId) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [projectId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

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
  if (!status) return 'bg-gray-100 text-gray-800';
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
          {/* Project Overview Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project?.client || '-'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project?.progress ?? '-'}%</div>
                <Progress value={project?.progress || 0} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project?.teamSize ?? '-'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Count</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project?.riskCount ?? '-'}</div>
              </CardContent>
            </Card>
          </div>

          {/* Milestones Table */}
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project?.milestones?.length ? project.milestones.map((ms: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{ms.name}</TableCell>
                      <TableCell>{ms.status}</TableCell>
                      <TableCell>{ms.date}</TableCell>
                      <TableCell>{ms.progress}%</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No milestones</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          {/* Delivery Metrics Filter */}
        <DeliveryMetricsFilter
          selectedFilter={selectedDeliveryFilter}
          onFilterChange={setSelectedDeliveryFilter}
          totalSprints={project?.sprints?.length || 0}
        />

        {/* Delivery KPIs - computed from sprints and filter */}
        {(() => {
          const sprints = project?.sprints || [];
          let filteredSprints = sprints;
          if (selectedDeliveryFilter.startsWith('sprint-')) {
            const sprintNum = parseInt(selectedDeliveryFilter.replace('sprint-', ''));
            filteredSprints = sprints.filter(s => s.sprintNumber === sprintNum);
          }
          // Default: average over all sprints
          const metrics = {
            sprintVelocity: filteredSprints.length ? (filteredSprints.reduce((sum, s) => sum + (s.velocity || 0), 0) / filteredSprints.length).toFixed(1) : '-',
            predictability: filteredSprints.length ? (filteredSprints.reduce((sum, s) => sum + (s.predictability || 0), 0) / filteredSprints.length).toFixed(1) : '-',
            defectLeakage: filteredSprints.length ? (filteredSprints.reduce((sum, s) => sum + (s.defectLeakage || 0), 0) / filteredSprints.length).toFixed(1) : '-',
            onTimeDelivery: filteredSprints.length ? (filteredSprints.reduce((sum, s) => sum + (s.onTimeDelivery || 0), 0) / filteredSprints.length).toFixed(1) : '-',
          };
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sprint Velocity</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.sprintVelocity}</div>
                  <p className="text-xs text-muted-foreground">Story points</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Predictability</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.predictability}%</div>
                  <p className="text-xs text-muted-foreground">Sprint commitment</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Defect Leakage</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.defectLeakage}</div>
                  <p className="text-xs text-muted-foreground">Production defects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.onTimeDelivery}%</div>
                  <p className="text-xs text-muted-foreground">Sprint goals met</p>
                </CardContent>
              </Card>
            </div>
          );
        })()}

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
          <TeamsTab teams={project?.teams} teamMembers={teamMembers} />
        </TabsContent>

        <TabsContent value="engineering" className="space-y-6">
          <Tabs defaultValue="development" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="qa">QA</TabsTrigger>
            </TabsList>

      <TabsContent value="development">
              <DevelopmentTab engineeringMetrics={engineeringMetrics} />
            </TabsContent>

            <TabsContent value="qa">
              <QATab engineeringMetrics={engineeringMetrics} />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddSprintDataModal 
        isOpen={isAddSprintModalOpen}
        onClose={(refresh?: boolean) => {
          setIsAddSprintModalOpen(false);
          if (refresh) {
            fetchData();
            // After adding a sprint, auto-select the latest sprint in the filter
            setTimeout(() => {
              if (project?.sprints?.length) {
                setSelectedDeliveryFilter(`sprint-${project.sprints.length}`);
              }
            }, 500);
          }
        }}
        projectId={project?.id}
        projectName={project?.name}
      />
      <EditProjectModal 
        isOpen={isEditProjectModalOpen}
        onClose={(refresh?: boolean) => {
          setIsEditProjectModalOpen(false);
          if (refresh) fetchData();
        }}
        projectData={project}
      />
    </div>
  );
};

export default ProjectDetails;
