import { useEffect, useState } from "react";
import { getFinance } from "@/lib/api";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Building, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Calculator,
  PieChart
} from "lucide-react";
import { ProjectFinancialHealthTable } from "@/components/finance/ProjectFinancialHealthTable";
import { BenchCostingCard } from "@/components/finance/BenchCostingCard";
import { FinancialKPISection } from "@/components/finance/FinancialKPISection";
import { ProjectTypeAnalysis } from "@/components/finance/ProjectTypeAnalysis";
import { EnhancedKPICard } from "@/components/dashboard/EnhancedKPICard";
import { Employee } from "@/types/employee";


interface ProjectFinancials {
  projectId: string;
  projectName: string;
  projectType: "Fixed Price" | "T&M" | "Milestone";
  client: string;
  sowValue: number;
  billingRate: string;
  startDate: string;
  endDate: string;
  actualCostToDate: number;
  billableResources: number;
  nonBillableResources: number;
  shadowResources: number;
  monthlyBurn: number;
  projectedCompletion: string;
  netPosition: number;
  healthStatus: "Positive" | "Negative" | "Critical";
  profitMargin: number;
  utilizationRate: number;
  resourceCosts: {
    billableCost: number;
    nonBillableCost: number;
    shadowCost: number;
  };
}

const FinanceDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("YTD");


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectFinancials, setProjectFinancials] = useState<ProjectFinancials[]>([]);
  const [benchEmployees, setBenchEmployees] = useState<Employee[]>([]);
  const [totalBenchCost, setTotalBenchCost] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with real auth token logic
        const token = localStorage.getItem('token') || '';
        const data = await getFinance(token);
        setProjectFinancials(data.projectFinancials || []);
        setBenchEmployees(data.benchEmployees || []);
        setTotalBenchCost(data.totalBenchCost || 0);
      } catch (err: any) {
        setError(err?.message || 'Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;


  // Financial KPIs
  const totalSOWValue = projectFinancials.reduce((sum, p) => sum + p.sowValue, 0);
  const totalActualCost = projectFinancials.reduce((sum, p) => sum + p.actualCostToDate, 0);
  const totalMonthlyBurn = projectFinancials.reduce((sum, p) => sum + p.monthlyBurn, 0) + totalBenchCost;
  const netMargin = ((totalSOWValue - totalActualCost - (totalBenchCost * 6)) / totalSOWValue) * 100;

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const kpiData = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalSOWValue),
      subtitle: "From all projects",
      icon: DollarSign,
      bgColor: "bg-blue-50",
      iconBgColor: "bg-blue-500",
      textColor: "text-blue-700",
      trend: { value: "+12%", isPositive: true }
    },
    {
      title: "Active Projects",
      value: projectFinancials.length,
      subtitle: "Currently running",
      icon: Building,
      bgColor: "bg-green-50",
      iconBgColor: "bg-green-500",
      textColor: "text-green-700",
      trend: { value: "+3", isPositive: true }
    },
    {
      title: "Monthly Burn",
      value: formatCurrency(totalMonthlyBurn),
      subtitle: "Current spend rate",
      icon: TrendingDown,
      bgColor: "bg-amber-50",
      iconBgColor: "bg-amber-500",
      textColor: "text-amber-700",
      trend: { value: "+8%", isPositive: false }
    },
    {
      title: "Net Margin",
      value: formatPercentage(netMargin),
      subtitle: "Profit margin",
      icon: TrendingUp,
      bgColor: netMargin > 0 ? "bg-emerald-50" : "bg-red-50",
      iconBgColor: netMargin > 0 ? "bg-emerald-500" : "bg-red-500",
      textColor: netMargin > 0 ? "text-emerald-700" : "text-red-700",
      trend: { value: netMargin > 0 ? "+5%" : "-2%", isPositive: netMargin > 0 }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 w-full">
      <div className="w-full max-w-none px-0">
        <div className="space-y-4 sm:space-y-6">
          <BreadcrumbNavigation />
          
          {/* Enhanced Header - Left aligned */}
          <div className="w-full">
            <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl border-0 w-full">
              <div className="relative w-full">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full -translate-y-16 sm:-translate-y-20 translate-x-16 sm:translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full translate-y-10 sm:translate-y-12 -translate-x-10 sm:-translate-x-12"></div>
                
                <div className="relative z-10 text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Financial Dashboard</h1>
                  <p className="text-base sm:text-lg text-blue-100 max-w-3xl">
                    Comprehensive financial overview and project profitability analysis
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Enhanced Financial KPIs - Left aligned */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-up w-full">
            {kpiData.map((kpi, index) => (
              <EnhancedKPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                subtitle={kpi.subtitle}
                icon={kpi.icon}
                trend={kpi.trend}
                bgColor={kpi.bgColor}
                iconBgColor={kpi.iconBgColor}
                textColor={kpi.textColor}
                className="animate-scale-in w-full"
                style={{ animationDelay: `${index * 0.1}s` as any }}
              />
            ))}
          </div>

          <Tabs defaultValue="projects" className="w-full">
            <div className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border rounded-xl p-2 max-w-full">
                <TabsTrigger value="projects" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Project Financials</span>
                  <span className="sm:hidden">Projects</span>
                </TabsTrigger>
                <TabsTrigger value="bench" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Bench Costing</span>
                  <span className="sm:hidden">Bench</span>
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <PieChart className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Analysis</span>
                  <span className="sm:hidden">Analysis</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="projects" className="space-y-4 sm:space-y-6 mt-6 animate-fade-in-up w-full">
              <ProjectFinancialHealthTable projects={projectFinancials} />
            </TabsContent>

            <TabsContent value="bench" className="space-y-4 sm:space-y-6 mt-6 animate-fade-in-up w-full">
              <BenchCostingCard employees={benchEmployees} totalBenchCost={totalBenchCost} />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4 sm:space-y-6 mt-6 animate-fade-in-up w-full">
              <ProjectTypeAnalysis projects={projectFinancials} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
