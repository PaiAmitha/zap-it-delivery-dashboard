// Allocate resources to a project
export async function allocateProject(token: string, allocationData: any) {
  return apiFetch('/api/resources/allocate-project', {
    method: 'POST',
    body: JSON.stringify(allocationData),
  }, token);
}
// Fetch project milestones
export async function getProjectMilestones(token: string, projectId: string | number) {
  return apiFetch(`/projects/${projectId}/milestones`, {}, token);
}

// Fetch project risks
export async function getProjectRisks(token: string, projectId: string | number) {
  return apiFetch(`/projects/${projectId}/risks`, {}, token);
}

// Fetch project team members
export async function getProjectTeamMembers(token: string, projectId: string | number) {
  return apiFetch(`/projects/${projectId}/team-members`, {}, token);
}

// Fetch project engineering metrics
export async function getProjectEngineeringMetrics(token: string, projectId: string | number) {
  return apiFetch(`/projects/${projectId}/engineering-metrics`, {}, token);
}
// Create a new sprint for a project
export async function createSprint(token: string, projectId: string | number, sprintData: any) {
  return apiFetch(`/projects/${projectId}/sprints`, {
    method: 'POST',
    body: JSON.stringify(sprintData),
  }, token);
}

// Update an existing project
export async function updateProject(token: string, projectId: string | number, projectData: any) {
  return apiFetch(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  }, token);
}
// Fetch project overview info for ProjectDetails overview tab
export async function getProjectOverview(token: string, projectId: string | number) {
  return apiFetch(`/projects/${projectId}/overview`, {}, token);
}
// Fetch detailed project info for ProjectDetails view
export async function getProjectDetails(token: string, projectId: string | number) {
  return apiFetch(`/projects/${projectId}/details`, {}, token);
}
// Escalation CRUD operations
export async function createEscalation(token: string, escalationData: any) {
  return apiFetch('/escalations', {
    method: 'POST',
    body: JSON.stringify(escalationData),
  }, token);
}

export async function updateEscalation(token: string, escalationId: string, escalationData: any) {
  return apiFetch(`/escalations/${escalationId}`, {
    method: 'PUT',
    body: JSON.stringify(escalationData),
  }, token);
}

export async function deleteEscalation(token: string, escalationId: string) {
  return apiFetch(`/escalations/${escalationId}`, {
    method: 'DELETE',
  }, token);
}
export async function getResignations(token: string) {
  return apiFetch('/api/resignations', {}, token);
}

export async function getInterns(token: string, params = {}) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/interns?${query}`, {}, token);
}
// NOTE: /dashboard endpoint only supports GET requests. Do not use POST, PUT, or DELETE for /dashboard.
// Types for dashboard API response
export interface DashboardData {
  billable_count: number;
  utilization_rate: number;
  avg_billing_rate: number;
  monthly_revenue: number;
  productivity_score: number;
  utilization_trend: Array<{ week: string; utilization: number }>;
  client_allocation: Array<{ client: string; resources: number; revenue: number }>;
  productivity_trend: Array<{ month: string; productivity: number; allocation: number }>;
  billable_resources: Array<{
    name: string;
    designation: string;
    client: string;
    utilization: number;
    billingRate: number;
    productivity: number;
  }>;
  // For TotalResourcesKPI
  total_resources: number;
  active_resources: number;
  inactive_resources: number;
  monthly_growth: number;
  billable_resources_count: number;
  non_billable_resources_count: number;
  department_data: Array<{ name: string; count: number; percentage: number; billable: number; nonBillable: number }>;
  designation_data: Array<{ name: string; count: number; percentage: number; billable: number; nonBillable: number }>;
  location_data: Array<{ name: string; count: number; percentage: number; billable: number; nonBillable: number }>;
  monthly_growth_data: Array<{ month: string; count: number }>;

  // For NonBillableResourcesKPI
  non_billable_cost_drain: number;
  avg_bench_days: number;
  reallocation_opportunities: number;
  bench_reason_data: Array<{ reason: string; count: number; cost: number; color?: string }>;
  bench_aging_data: Array<{ bucket: string; count: number; cost: number; riskLevel: string }>;
  weekly_movement_data: Array<{ week: string; moved: number; added: number }>;
  non_billable_location_distribution: Array<{ location: string; count: number; cost: number }>;
  non_billable_resources_list: Array<{
    name: string;
    designation: string;
    reason: string;
    benchDays: number;
    location: string;
    monthlyCost: number;
    suggestion: string;
  }>;
  projectCards: any[];
  dashboard_kpis: any;
  // For Dashboard
  active_projects: Array<{
    id: number;
    name: string;
    customer: string;
    category: string;
    healthStatus: string;
    onTimePercentage: number;
    description: string;
    progress: number;
    teamSize: number;
  }>;
  // For InternsKPI
  total_interns: number;
  interns_assigned: number;
  interns_unassigned: number;
  intern_conversion_rate: number;
  avg_learning_hours: number;
  avg_productive_hours: number;
  intern_conversion_funnel: Array<{ name: string; value: number; fill?: string }>;
  intern_monthly_conversion: Array<{ month: string; conversionRate: number }>;
  intern_learning_vs_productive: Array<{ intern: string; learning: number; productive: number }>;
  intern_location_distribution: Array<{ location: string; count: number }>;
  intern_details_list: Array<{
    name: string;
    designation: string;
    project: string;
    mentor: string;
    status: string;
    department: string;
    learningHours: number;
    productiveHours: number;
    feedback: string;
    conversionPotential: string;
  }>;
}

// Types for finance API response (extend as needed)
export interface FinanceData {
  projectFinancials: Array<any>;
  benchEmployees: Array<any>;
  totalBenchCost: number;
  departmentProjectFinancials: Array<any>;
  departmentBenchResources: {
    totalBenchResources: number;
    monthlyCost: number;
    skillBreakdown: Array<{ skill: string; count: number; monthlyCost: number }>;
  };
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string
): Promise<T> {
  // Always set Content-Type for POST/PUT requests unless already set
  let headers: Record<string, string> = {
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  };
  // Fix: ensure Content-Type is set regardless of header case
  const hasContentType = Object.keys(headers).some(
    (k) => k.toLowerCase() === 'content-type'
  );
  if ((options.method === 'POST' || options.method === 'PUT') && !hasContentType) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, ...error };
  }
  return res.json();
}

export async function login(email: string, password: string) {
  return apiFetch<{ token: string; user: any }>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}


// Resource CRUD


export async function getResource(token: string, employeeId: string) {
  return apiFetch(`/api/resources/${employeeId}`, {}, token);
}

export async function createResource(token: string, resourceData: any) {
  return apiFetch('/api/resources', {
    method: 'POST',
    body: JSON.stringify(resourceData),
  }, token);
}

export async function updateResource(token: string, resourceId: string, resourceData: any) {
  return apiFetch(`/api/resources/${resourceId}`, {
    method: 'PUT',
    body: JSON.stringify(resourceData),
  }, token);
}

export async function deleteResource(token: string, resourceId: string) {
  return apiFetch(`/api/resources/${resourceId}`, {
    method: 'DELETE',
  }, token);
}

export async function getResources(token: string, params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/resources?${query}`, {}, token);
}



export async function getProjects(token: string, params = {}) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/projects?${query}`, {}, token);
}

export async function getEscalations(token: string, params = {}) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/escalations?${query}`, {}, token);
}

// Fetch project sprints
export async function getProjectSprints(token: string, projectId: string | number) {
  return apiFetch(`/projects/${projectId}/sprints`, {}, token);
}

/**
 * Fetch dashboard data. This endpoint only supports GET requests.
 * @param token Auth token
 */
export async function getDashboard(token: string) {
  // Always use GET for /dashboard
  return apiFetch<DashboardData>('/dashboard', { method: 'GET' }, token);
}

export async function getFinance(token: string) {
  return apiFetch<FinanceData>('/finance', {}, token);
}

export async function getLocations(token: string) {
  return apiFetch<{ locations: string[] }>(`/locations`, {}, token);
}

export async function createProject(token: string, projectData: any) {
  return apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  }, token);
}

export async function createEmployee(token: string, employeeData: any) {
  return apiFetch('/employees', {
    method: 'POST',
    body: JSON.stringify(employeeData),
  }, token);
}

// Upcoming Releases
export async function getUpcomingReleases(token: string) {
  return apiFetch('/api/resources/upcoming-releases', {}, token);
}

// Interns
export async function getInternResources(token: string) {
  return apiFetch('/api/resources/interns', {}, token);
}

// Financial Dashboard
export async function getFinancialDashboard(token: string) {
  return apiFetch('/api/resources/financial-overview', {}, token);
}

// Resource Details
export async function getResourceDetails(token: string, employeeId: string | number) {
  return apiFetch(`/api/resources/${employeeId}`, {}, token);
}
export async function deleteIntern(token: string, internId: number) {
  return apiFetch(`/api/interns/${internId}`, {
    method: 'DELETE',
  }, token);
}
