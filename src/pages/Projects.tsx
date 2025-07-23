
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { UserHoverCard } from "@/components/ui/user-hover-card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Plus, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id: string;
  name: string;
  description: string;
  customer: string;
  category: string;
  status: "On Track" | "At Risk" | "Critical" | "Delayed";
  progress: number;
  teamSize: number;
  teamLead?: string;
}

const Projects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [customerFilter, setCustomerFilter] = useState("All Customers");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Handle filter from Dashboard KPI navigation
  useEffect(() => {
    if (location.state?.filter) {
      const { type, value } = location.state.filter;
      if (type === "status") {
        setStatusFilter(value);
      }
      // Clear the state to avoid persistence on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "AI Chatbot Integration",
      description: "Next generation AI chatbot for customer support",
      customer: "Zenmate",
      category: "At Risk",
      status: "On Track",
      progress: 67,
      teamSize: 8,
      teamLead: "Sarah Johnson"
    },
    {
      id: "2",
      name: "Blockchain Analytics",
      description: "Blockchain analytics dashboard",
      customer: "Zenmate",
      category: "Critical",
      status: "Critical",
      progress: 34,
      teamSize: 10,
      teamLead: "Mike Chen"
    },
    {
      id: "3",
      name: "E-Commerce Platform",
      description: "Core platform development and API integration",
      customer: "TechCorp Inc",
      category: "Customer",
      status: "On Track",
      progress: 85,
      teamSize: 12,
      teamLead: "Alex Rodriguez"
    },
    {
      id: "4",
      name: "Healthcare Portal",
      description: "Patient management portal",
      customer: "MedLife Systems",
      category: "Customer",
      status: "At Risk",
      progress: 58,
      teamSize: 15,
      teamLead: "Emily Davis"
    },
    {
      id: "5",
      name: "IoT Dashboard",
      description: "IoT device monitoring dashboard",
      customer: "Zenmate",
      category: "On Track",
      status: "On Track",
      progress: 72,
      teamSize: 4,
      teamLead: "James Wilson"
    },
    {
      id: "6",
      name: "Mobile Banking App",
      description: "Modern mobile banking application",
      customer: "FinanceFruit Bank",
      category: "On Track",
      status: "On Track",
      progress: 92,
      teamSize: 6,
      teamLead: "Daniel Lee"
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      "On Track": "bg-green-100 text-green-800 border-green-200",
      "At Risk": "bg-orange-100 text-orange-800 border-orange-200",
      "Critical": "bg-red-100 text-red-800 border-red-200",
      "Delayed": "bg-gray-100 text-gray-800 border-gray-200"
    };
    return statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleViewProjectDetails = (projectId: string) => {
    navigate(`/project-details/${projectId}`);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || project.status === statusFilter;
    const matchesCustomer = customerFilter === "All Customers" || project.customer === customerFilter;
    const matchesCategory = categoryFilter === "All Categories" || project.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCustomer && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all your projects</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <CardTitle>All Projects</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Status">All Status</SelectItem>
                    <SelectItem value="On Track">On Track</SelectItem>
                    <SelectItem value="At Risk">At Risk</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Customers">All Customers</SelectItem>
                    <SelectItem value="Zenmate">Zenmate</SelectItem>
                    <SelectItem value="TechCorp Inc">TechCorp Inc</SelectItem>
                    <SelectItem value="MedLife Systems">MedLife Systems</SelectItem>
                    <SelectItem value="FinanceFruit Bank">FinanceFruit Bank</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Categories">All Categories</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="At Risk">At Risk</SelectItem>
                    <SelectItem value="On Track">On Track</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Team Lead</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Team Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="text-gray-600">{project.description}</TableCell>
                  <TableCell>{project.customer}</TableCell>
                  <TableCell>
                    {project.teamLead && (
                      <UserHoverCard
                        name={project.teamLead}
                        role="Team Lead"
                        department="Engineering"
                        location="London, UK"
                      >
                        <span className="cursor-pointer hover:text-primary hover:underline">
                          {project.teamLead}
                        </span>
                      </UserHoverCard>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadge(project.status)} border`}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{project.teamSize}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleViewProjectDetails(project.id)}
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateProjectDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
    </div>
  );
};

export default Projects;
