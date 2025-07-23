
export interface Employee {
  employee_id: string;
  full_name: string;
  email: string;
  designation: string;
  department: string;
  location: string;
  status: 'Billable' | 'Non-Billable';
  resource_type: string;
  experience_level: string;
  cost_rate: number;
  billing_rate: number;
  utilization_percentage: number;
  productivity_score: number;
  bench_days: number;
  last_project_end_date: string | null;
  primary_skills: string[];
  secondary_skills: string[];
  years_of_experience: number;
  joining_date: string;
  bench_start_date: string | null;
}

export interface ResourceFilter {
  type: 'location' | 'seniority' | 'skill' | 'engagement';
  value: string;
  displayName: string;
}
