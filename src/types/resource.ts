export interface ResourceData {
  // HR Data Section
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  seniorityLevel: string;
  experience: number;
  location: string;
  joiningDate: string;
  employmentType: string;
  reportingManager: string;
  
  // Resource Management Section
  primarySkill: string;
  skillCategory: string;
  billableStatus: boolean;
  currentEngagement: string;
  projectName?: string;
  engagementDescription: string;
  engagementStartDate?: string;
  engagementEndDate?: string;
  agingInNonBillable: number;
  currentBenchStatus: boolean;
  engagementDetail: string;
  
  // Intern Section
  isIntern: boolean;
  internshipStartDate?: string;
  internshipEndDate?: string;
  assignedProject?: string;
  mentorName?: string;
  stipend?: number;
  
  // Finance Section
  monthlySalaryCost: number;
  billingRate?: number;
  monthlyRevenueGenerated: number;
  costCenter: string;
  totalYTDCost: number;
  totalYTDRevenue: number;
}