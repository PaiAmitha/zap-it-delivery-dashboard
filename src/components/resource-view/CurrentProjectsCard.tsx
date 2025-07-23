
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  title: string;
  role: string;
  client: string;
  started: string;
  status: string;
}

interface CurrentProjectsCardProps {
  projects: Project[];
}

export const CurrentProjectsCard = ({ projects }: CurrentProjectsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {projects.map((project, index) => (
          <div key={index} className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{project.title}</h4>
              <Badge className="bg-green-100 text-green-800">{project.status}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">{project.role}</p>
            <p className="text-sm text-gray-500">Started: {project.started}</p>
            <p className="text-sm text-gray-500">Client: {project.client}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
