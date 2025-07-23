import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  projectName: string;
  customer: string;
  healthStatus: string;
  currentStage: string;
  onTimePercentage: number;
  endDate: string;
  riskLevel: string;
  dmPo: string;
}

interface ProjectHealthTableProps {
  projects: Project[];
}

export const ProjectHealthTable = ({ projects }: ProjectHealthTableProps) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'green': return 'status-badge status-green';
      case 'amber': return 'status-badge status-yellow';
      case 'red': return 'status-badge status-red';
      default: return 'status-badge status-gray';
    }
  };

  const getRiskBadgeClass = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'status-badge status-green';
      case 'medium': return 'status-badge status-yellow';
      case 'high': return 'status-badge status-red';
      default: return 'status-badge status-gray';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Health Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Project Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Health Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Current Stage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">On-Time %</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">End Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Risk Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">DM/PO</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{project.projectName}</td>
                  <td className="py-3 px-4">{project.customer}</td>
                  <td className="py-3 px-4">
                    <span className={getStatusBadgeClass(project.healthStatus)}>
                      {project.healthStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">{project.currentStage}</td>
                  <td className="py-3 px-4">{project.onTimePercentage}%</td>
                  <td className="py-3 px-4">{project.endDate}</td>
                  <td className="py-3 px-4">
                    <span className={getRiskBadgeClass(project.riskLevel)}>
                      {project.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4">{project.dmPo}</td>
                  <td className="py-3 px-4">
                    <Link 
                      to={`/project-details/${project.id}`} 
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};