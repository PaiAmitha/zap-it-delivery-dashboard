


import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EscalationTable } from "../components/dashboard/EscalationTable";
import { CreateEscalationDialog } from "../components/dashboard/CreateEscalationDialog";
import { EditEscalationDialog } from "../components/dashboard/EditEscalationDialog";
import { BreadcrumbNavigation } from "../components/layout/BreadcrumbNavigation";
import { useToast } from "../hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { getEscalations, createEscalation, updateEscalation, deleteEscalation } from "../lib/escalationApi";

interface Escalation {
  id: string;
  title: string;
  customer: string;
  project: string;
  owner: string;
  priority: string;
  status: string;
  date_raised: string;
  resolution_eta: string;
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

  const [filteredEscalations, setFilteredEscalations] = useState<Escalation[]>([]);
  const [uniqueCustomers, setUniqueCustomers] = useState<string[]>([]);
  const [uniqueProjects, setUniqueProjects] = useState<string[]>([]);
  const [filteredKPIs, setFilteredKPIs] = useState({
    totalEscalations: 0,
    criticalIssues: 0,
    highPriority: 0,
    avgResolutionRate: 0
  });

  // Handler for create button
  const handleCreateNew = () => {
    setCreateDialogOpen(true);
  };


  // Handler for reset filters button
  const handleResetFilters = () => {
    setCustomerFilter("All Customers");
    setProjectFilter("All Projects");
    setPriorityFilter("All Priorities");
    setStatusFilter("All Statuses");
  };

  // Handler for edit escalation
  const handleEdit = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
    setEditDialogOpen(true);
  };

  // Handler for delete escalation
  const handleDelete = async (id: string) => {
    try {
      await deleteEscalation(Number(id));
      const result = await getEscalations();
      setEscalations(Array.isArray(result) ? result : []);
      toast({
        title: "Escalation Deleted",
        description: "The escalation has been successfully deleted.",
      });
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err?.message || "Could not delete escalation.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    // Filter escalations and compute analytics
    const filtered = escalations.filter(escalation => {
      const customerMatch = customerFilter === "All Customers" || escalation.customer === customerFilter;
      const projectMatch = projectFilter === "All Projects" || escalation.project === projectFilter;
      const priorityMatch = priorityFilter === "All Priorities" || escalation.priority === priorityFilter;
      const statusMatch = statusFilter === "All Statuses" || escalation.status === statusFilter;
      return customerMatch && projectMatch && priorityMatch && statusMatch;
    });
    setFilteredEscalations(filtered);
    setUniqueCustomers([...new Set(escalations.map(e => e.customer))].sort());
    setUniqueProjects([...new Set(escalations.map(e => e.project))].sort());
    const totalEscalations = filtered.length;
    const criticalIssues = filtered.filter(e => e.priority === 'Critical').length;
    const highPriority = filtered.filter(e => e.priority === 'High').length;
    const resolvedCount = filtered.filter(e => e.status === 'Resolved').length;
    const avgResolutionRate = totalEscalations > 0 ? Math.round((resolvedCount / totalEscalations) * 100) : 0;
    setFilteredKPIs({ totalEscalations, criticalIssues, highPriority, avgResolutionRate });
  }, [escalations, customerFilter, projectFilter, priorityFilter, statusFilter]);

  // Analytics: Monthly escalation volume and resolution rate
  const monthlyVolumeData = useMemo(() => {
    const counts: { [month: string]: number } = {};
    filteredEscalations.forEach(e => {
      const month = e.date_raised ? new Date(e.date_raised).toLocaleString('default', { month: 'short', year: 'numeric' }) : 'Unknown';
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts).map(([month, escalations]) => ({ month, escalations })).sort((a, b) => {
      // Parse month string to Date for sorting
      const parseMonth = (m: string) => {
        const [mon, year] = m.split(' ');
        return new Date(`${mon} 1, ${year}`);
      };
      return parseMonth(a.month).getTime() - parseMonth(b.month).getTime();
    });
  }, [filteredEscalations]);

  const resolutionTrendData = useMemo(() => {
    const stats: { [month: string]: { total: number; resolved: number } } = {};
    filteredEscalations.forEach(e => {
      const month = e.date_raised ? new Date(e.date_raised).toLocaleString('default', { month: 'short', year: 'numeric' }) : 'Unknown';
      if (!stats[month]) stats[month] = { total: 0, resolved: 0 };
      stats[month].total += 1;
      if (e.status === 'Resolved') stats[month].resolved += 1;
    });
    return Object.entries(stats).map(([month, { total, resolved }]) => ({ month, rate: total > 0 ? Math.round((resolved / total) * 100) : 0 })).sort((a, b) => {
      const parseMonth = (m: string) => {
        const [mon, year] = m.split(' ');
        return new Date(`${mon} 1, ${year}`);
      };
      return parseMonth(a.month).getTime() - parseMonth(b.month).getTime();
    });
  }, [filteredEscalations]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchEscalations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const result = await getEscalations();
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

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
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
      {/* Escalation Analytics Charts and Table */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Escalation Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyVolumeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="escalations" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolution Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={resolutionTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* Escalations Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2 items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <CardTitle>🚨 Customer Escalations</CardTitle>
              <Button
                variant="default"
                size="sm"
                className="font-semibold"
                onClick={handleCreateNew}
              >
                + New Escalation
              </Button>
            </div>
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
        onCreate={(newEscalation) => {
          // If backend returns the created escalation, add it to the list; otherwise, refetch
          if (newEscalation && newEscalation.id) {
            setEscalations(prev => [newEscalation, ...prev]);
          } else {
            // fallback: refetch all
            getEscalations().then(result => {
              if (Array.isArray(result)) {
                setEscalations(result);
              } else if (result && Array.isArray((result as any).escalations)) {
                setEscalations((result as any).escalations);
              }
            });
          }
        }}
      />
      <EditEscalationDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        escalation={selectedEscalation}
        onUpdate={(updatedEscalation) => {
          if (updatedEscalation && updatedEscalation.id) {
            setEscalations(prev => prev.map(e => e.id === updatedEscalation.id ? updatedEscalation : e));
          } else {
            getEscalations().then(result => {
              if (Array.isArray(result)) {
                setEscalations(result);
              } else if (result && Array.isArray((result as any).escalations)) {
                setEscalations((result as any).escalations);
              }
            });
          }
        }}
      />
    </div>
  );
}

export default Escalations;
