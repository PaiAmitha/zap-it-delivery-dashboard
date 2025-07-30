export interface ProjectEngagement {
  projectName: string;
  client?: string;
  role: string;
  period?: string;
  totalHours?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface ResourceData {
  employeeId?: string;
  // Contact Information
  email?: string;
  phone?: string;
  location?: string;

  // HR Details
  resourceId: string;
  fullName: string;
  designation: string;
  department: string;
  seniorityLevel: string;
  experience: number;
  joiningDate: string;
  employmentType: string;
  reportingManager: string;
  costCenter: string;

  // Skills & Expertise
  primarySkills?: string[];
  skills: string[];

  // Current Projects
  currentProjects?: Array<{
    id?: string | number;
    name: string;
    customer?: string;
    category?: string;
    healthStatus?: string;
    start_date?: string;
    end_date?: string;
    progress?: number;
    teamSize?: number;
  }>;

  // Past Project Engagements
  pastProjectEngagements?: ProjectEngagement[];

  // Upcoming Engagements
  upcomingEngagements?: ProjectEngagement[];

  // Resource Management Section
  billableStatus: boolean;
  currentEngagement?: string;
  engagementDescription?: string;
  engagementStartDate?: string;
  engagementEndDate?: string;
  agingInNonBillable?: number;
  currentBenchStatus?: boolean;
  engagementDetail?: string;

  // Intern Section
  isIntern?: boolean;
  internshipStartDate?: string;
  internshipEndDate?: string;
  assignedProject?: string;
  mentorName?: string;
  stipend?: number;

  // Finance Section
  monthlySalaryCost?: number;
  billingRate?: number;
  monthlyRevenueGenerated?: number;
  totalYTDCost?: number;
  totalYTDRevenue?: number;

  // Calculated fields
  yearsAtCompany?: number;
}