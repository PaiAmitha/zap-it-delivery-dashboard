
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EscalationTable } from "@/components/dashboard/EscalationTable";
import { CreateEscalationDialog } from "@/components/dashboard/CreateEscalationDialog";
import { EditEscalationDialog } from "@/components/dashboard/EditEscalationDialog";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEscalations } from "@/lib/api";

interface Escalation {
  id: string;
  title: string;
  customer: string;
  project: string;
  owner: string;
  priority: string;
  status: string;
  dateRaised: string;
  resolutionETA: string;
  description?: string;
}

const Escalations = () => {
  const { toast } = useToast();
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [customerFilter, setCustomerFilter] = useState("All Customers");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Sample chart data
  const monthlyVolumeData = [
    { month: 'Sep 2024', escalations: 0 },
    { month: 'Oct 2024', escalations: 0 },
    { month: 'Nov 2024', escalations: 0 },
    { month: 'Dec 2024', escalations: 0 },
    { month: 'Jan 2025', escalations: 0 },
    { month: 'Feb 2025', escalations: 0 }
  ];

  const resolutionTrendData = [
    { month: 'Sep 2024', rate: 100 },
    { month: 'Oct 2024', rate: 100 },
    { month: 'Nov 2024', rate: 100 },
    { month: 'Dec 2024', rate: 100 },
    { month: 'Jan 2025', rate: 100 },
    { month: 'Feb 2025', rate: 100 }
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchEscalations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const result = await getEscalations(token) as { escalations?: Escalation[] } | Escalation[];
        if (Array.isArray(result)) {
          setEscalations(result);
        } else if (result && Array.isArray(result.escalations)) {
          setEscalations(result.escalations);
        } else {
          setEscalations([]);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch escalations');
      } finally {
        setLoading(false);
      }
    };
    fetchEscalations();
  }, []);

  // Extract unique customers and projects for dropdown options
  const uniqueCustomers = useMemo(() => {
    const customers = [...new Set(escalations.map(escalation => escalation.customer))];
    return customers.sort();
  }, [escalations]);

  const uniqueProjects = useMemo(() => {
    const projects = [...new Set(escalations.map(escalation => escalation.project))];
    return projects.sort();
  }, [escalations]);

  // Filter escalations based on selected filters
  const filteredEscalations = useMemo(() => {
    return escalations.filter(escalation => {
      const customerMatch = customerFilter === "All Customers" || escalation.customer === customerFilter;
      const projectMatch = projectFilter === "All Projects" || escalation.project === projectFilter;
      const priorityMatch = priorityFilter === "All Priorities" || escalation.priority === priorityFilter;
      const statusMatch = statusFilter === "All Statuses" || escalation.status === statusFilter;
      
      return customerMatch && projectMatch && priorityMatch && statusMatch;
    });
  }, [escalations, customerFilter, projectFilter, priorityFilter, statusFilter]);

  // Update KPIs based on filtered data
  const filteredKPIs = useMemo(() => {
    const totalEscalations = filteredEscalations.length;
    const criticalIssues = filteredEscalations.filter(e => e.priority === 'Critical').length;
    const highPriority = filteredEscalations.filter(e => e.priority === 'High').length;
    const resolvedCount = filteredEscalations.filter(e => e.status === 'Resolved').length;
    const avgResolutionRate = totalEscalations > 0 ? Math.round((resolvedCount / totalEscalations) * 100) : 0;

    return {
      totalEscalations,
      criticalIssues,
      highPriority,
      avgResolutionRate
    };
  }, [filteredEscalations]);

  const handleEdit = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEscalations(prev => prev.filter(esc => esc.id !== id));
    toast({
      title: "Escalation Deleted",
      description: "The escalation has been successfully deleted.",
    });
  };

  const handleCreateNew = () => {
    setCreateDialogOpen(true);
  };

  const handleResetFilters = () => {
    setCustomerFilter("All Customers");
    setProjectFilter("All Projects");
    setPriorityFilter("All Priorities");
    setStatusFilter("All Statuses");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <BreadcrumbNavigation />
        <div className="text-center py-12">Loading escalations...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-6">
        <BreadcrumbNavigation />
        <Card>
          <CardContent className="text-center py-12">
            <span className="text-red-500">{error}</span>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      {/* ...existing code... */}

      {/* Summary KPIs - Updated with filtered data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredKPIs.totalEscalations}</div>
            <div className="text-sm text-gray-600">Total Escalations</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{filteredKPIs.criticalIssues}</div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{filteredKPIs.highPriority}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{filteredKPIs.avgResolutionRate}%</div>
            <div className="text-sm text-gray-600">Avg Resolution Rate</div>
          </div>
        </Card>
      </div>

      {/* Escalations Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <CardTitle>🚨 Customer Escalations</CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Customers">All Customers</SelectItem>
                  {uniqueCustomers.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Projects">All Projects</SelectItem>
                  {uniqueProjects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Priorities">All Priorities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Statuses">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              {(customerFilter !== "All Customers" || projectFilter !== "All Projects" || 
                priorityFilter !== "All Priorities" || statusFilter !== "All Statuses") && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetFilters}
                  className="text-xs"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>
          
          {/* Filter Summary */}
          {filteredEscalations.length !== escalations.length && (
            <div className="text-sm text-gray-600 mt-2">
              Showing {filteredEscalations.length} of {escalations.length} escalations
              {customerFilter !== "All Customers" && (
                <Badge variant="secondary" className="ml-2">Customer: {customerFilter}</Badge>
              )}
              {projectFilter !== "All Projects" && (
                <Badge variant="secondary" className="ml-2">Project: {projectFilter}</Badge>
              )}
              {priorityFilter !== "All Priorities" && (
                <Badge variant="secondary" className="ml-2">Priority: {priorityFilter}</Badge>
              )}
              {statusFilter !== "All Statuses" && (
                <Badge variant="secondary" className="ml-2">Status: {statusFilter}</Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <EscalationTable 
            escalations={filteredEscalations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <CreateEscalationDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />

      <EditEscalationDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        escalation={selectedEscalation}
      />
    </div>
  );
};

export default Escalations;
