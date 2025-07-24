export async function getResignations(token: string, params = {}) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/resignations?${query}`, {}, token);
}

export async function getInterns(token: string, params = {}) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/interns?${query}`, {}, token);
}
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

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string
): Promise<T> {
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
  const mergedHeaders = {
    ...baseHeaders,
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  };
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: mergedHeaders,
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

export async function getEmployees(token: string, params = {}) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/employees?${query}`, {}, token);
}

export async function getEmployee(token: string, employeeId: string) {
  return apiFetch(`/employees/${employeeId}`, {}, token);
}

export async function getProjects(token: string, params = {}) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/projects?${query}`, {}, token);
}

export async function getEscalations(token: string, params = {}) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/escalations?${query}`, {}, token);
}

export async function getDashboard(token: string) {
  return apiFetch<DashboardData>('/dashboard', {}, token);
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
