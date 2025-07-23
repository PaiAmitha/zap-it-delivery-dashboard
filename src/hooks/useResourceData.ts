
export const useResourceData = () => {
  const seniorityData = [
    { level: "Junior (1-3 yrs)", count: 10, percentage: 20, monthlyCost: 45000, ytdCost: 270000 },
    { level: "Mid-Senior (3-6 yrs)", count: 25, percentage: 50, monthlyCost: 125000, ytdCost: 750000 },
    { level: "Senior (6+ yrs)", count: 15, percentage: 30, monthlyCost: 95000, ytdCost: 570000 },
  ];

  const skillData = [
    { category: "Application Development", count: 12, monthlyCost: 72000 },
    { category: "DevOps", count: 4, monthlyCost: 28000 },
    { category: "QA", count: 8, monthlyCost: 40000 },
    { category: "Data Engineering", count: 5, monthlyCost: 35000 },
    { category: "DS & AI", count: 3, monthlyCost: 25000 },
    { category: "Security", count: 2, monthlyCost: 18000 },
    { category: "BA", count: 2, monthlyCost: 15000 },
    { category: "Product Mgmt & Design", count: 1, monthlyCost: 12000 },
  ];

  const agingData = [
    { bucket: "< 30 days", count: 12, monthlyCost: 65000, avgDailyCost: 2167, riskLevel: "low" as const },
    { bucket: "30-59 days", count: 9, monthlyCost: 52000, avgDailyCost: 1733, riskLevel: "medium" as const },
    { bucket: "60-89 days", count: 5, monthlyCost: 35000, avgDailyCost: 1167, riskLevel: "medium" as const },
    { bucket: "≥ 90 days", count: 7, monthlyCost: 48000, avgDailyCost: 1600, riskLevel: "high" as const },
  ];

  const engagementData = [
    { type: "In Training", count: 10, monthlyCost: 55000, startDate: "01-Jun-25", endDate: "30-Jun-25", notes: "Skill & Training Module" },
    { type: "Shadowing Customer Project", count: 8, monthlyCost: 45000, startDate: "15-May-25", endDate: "Ongoing", notes: "Linked Project" },
    { type: "Internal Projects", count: 6, monthlyCost: 35000, startDate: "Varies", endDate: "", notes: "Linked Internal Project" },
    { type: "PIP (Performance Plan)", count: 2, monthlyCost: 12000, startDate: "01-May-25", endDate: "01-Jul-25", notes: "PIP Tracker Linked" },
  ];

  const internsData = [
    { name: "Sarah Johnson", startDate: "01-Jun-25", endDate: "31-Aug-25", department: "QA", assignedProject: "Internal QA Tool", status: "Active" as const, mentor: "John Smith", education: "Computer Science - MIT", stipend: 2500, conversionPotential: "High" as const },
    { name: "Mike Chen", startDate: "15-May-25", endDate: "15-Aug-25", department: "DevOps", assignedProject: "CI/CD Pipeline", status: "Active" as const, mentor: "Lisa Wong", education: "Software Engineering - Stanford", stipend: 2800, conversionPotential: "High" as const },
    { name: "Emily Davis", startDate: "01-Jul-25", endDate: "30-Sep-25", department: "Frontend", assignedProject: "Dashboard Redesign", status: "Upcoming" as const, mentor: "Tom Wilson", education: "Computer Science - Berkeley", stipend: 2600, conversionPotential: "Medium" as const },
  ];

  const monthlyFinancialData = [
    { month: "Jan 2025", totalCost: 850000, billableCost: 535000, nonBillableCost: 285000, internCost: 30000, nonBillablePercentage: 33.5 },
    { month: "Feb 2025", totalCost: 875000, billableCost: 545000, nonBillableCost: 295000, internCost: 35000, nonBillablePercentage: 33.7 },
    { month: "Mar 2025", totalCost: 920000, billableCost: 580000, nonBillableCost: 310000, internCost: 30000, nonBillablePercentage: 33.7 },
    { month: "Apr 2025", totalCost: 895000, billableCost: 565000, nonBillableCost: 305000, internCost: 25000, nonBillablePercentage: 34.1 },
    { month: "May 2025", totalCost: 945000, billableCost: 595000, nonBillableCost: 325000, internCost: 25000, nonBillablePercentage: 34.4 },
    { month: "Jun 2025", totalCost: 965000, billableCost: 605000, nonBillableCost: 335000, internCost: 25000, nonBillablePercentage: 34.7 },
  ];

  const ytdTotals = {
    total: 5450000,
    billable: 3425000,
    nonBillable: 1855000,
    intern: 170000,
  };

  const releaseResources = [
    {
      id: "1",
      name: "Alex Rodriguez",
      currentProject: "Project Alpha",
      releaseDate: "2025-08-15",
      role: "Senior Developer",
      experience: "5+ years",
      skillset: ["React", "Node.js", "TypeScript", "AWS"],
      utilizationPercentage: 85,
      status: "confirmed" as const
    },
    {
      id: "2", 
      name: "Emma Thompson",
      currentProject: "Project Beta",
      releaseDate: "2025-09-01",
      role: "QA Engineer",
      experience: "3-5 years", 
      skillset: ["Selenium", "Jest", "API Testing", "Automation"],
      utilizationPercentage: 90,
      status: "tentative" as const
    },
    {
      id: "3",
      name: "David Kim",
      currentProject: "Project Gamma", 
      releaseDate: "2025-09-30",
      role: "DevOps Engineer",
      experience: "5+ years",
      skillset: ["Docker", "Kubernetes", "CI/CD", "Terraform"],
      utilizationPercentage: 100,
      status: "at-risk" as const
    }
  ];

  return {
    seniorityData,
    skillData,
    agingData,
    engagementData,
    internsData,
    monthlyFinancialData,
    ytdTotals,
    releaseResources
  };
};
