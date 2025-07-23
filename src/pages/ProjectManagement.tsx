import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectHealthTable } from "@/components/dashboard/ProjectHealthTable";
import { ResourceOverviewCard } from "@/components/dashboard/ResourceOverviewCard";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { Link } from "react-router-dom";
import { Plus, FolderPlus } from "lucide-react";

const ProjectManagement = () => {
  const [projects] = useState([
    {
      id: "1",
      projectName: "Project Alpha",
      customer: "TechCorp Industries",
      healthStatus: "Green",
      currentStage: "Development",
      onTimePercentage: 92,
      endDate: "6/30/2024",
      riskLevel: "Low",
      dmPo: "Sarah Johnson"
    },
    {
      id: "2", 
      projectName: "Project Beta",
      customer: "InnovateCorp",
      healthStatus: "Amber",
      currentStage: "Testing",
      onTimePercentage: 78,
      endDate: "8/15/2024",
      riskLevel: "Medium",
      dmPo: "Mike Chen"
    },
    {
      id: "3",
      projectName: "Project Gamma", 
      customer: "FutureTech Solutions",
      healthStatus: "Red",
      currentStage: "Planning",
      onTimePercentage: 45,
      endDate: "12/20/2024", 
      riskLevel: "High",
      dmPo: "Alex Rodriguez"
    }
  ]);

  const resourceOverviewData = {
    totalEngineers: 85,
    benchPercentage: 15,
    allocationPercentage: 87,
    roleDistribution: [
      { role: "Frontend", count: 25, percentage: 29 },
      { role: "Backend", count: 30, percentage: 35 },
      { role: "DevOps", count: 12, percentage: 14 },
      { role: "QA", count: 18, percentage: 22 }
    ],
    experienceDistribution: [
      { level: "Junior", count: 20, percentage: 24 },
      { level: "Mid", count: 40, percentage: 47 },
      { level: "Senior", count: 25, percentage: 29 }
    ],
    billableRatio: {
      billable: 72,
      nonBillable: 13,
      billablePercentage: 85
    }
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Management</h1>
          <p className="text-gray-600">Monitor project health, resources, and delivery metrics</p>
        </div>
        <Link to="/add-project">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/add-project">
              <Button className="w-full h-20 flex flex-col gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200" variant="outline">
                <FolderPlus size={24} />
                <span>Create New Project</span>
              </Button>
            </Link>
            <Link to="/project-allocation">
              <Button className="w-full h-20 flex flex-col gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200" variant="outline">
                <Plus size={24} />
                <span>Allocate Resources</span>
              </Button>
            </Link>
            <Link to="/resource-management">
              <Button className="w-full h-20 flex flex-col gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200" variant="outline">
                <Plus size={24} />
                <span>Manage Resources</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <ResourceOverviewCard {...resourceOverviewData} />

      <ProjectHealthTable projects={projects} />
    </div>
  );
};

export default ProjectManagement;
