
import { EnhancedKPICard } from "@/components/dashboard/EnhancedKPICard";
import { Users, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/api";

export const DashboardKPIs = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const data = await getDashboard(token);
        setDashboard(data);
      } catch (err) {
        setDashboard(null);
      }
    };
    fetchDashboard();
  }, []);

  const kpiData = dashboard ? [
    {
      title: "Active Projects",
      value: dashboard.active_projects?.length ?? 0,
      subtitle: "Currently in progress",
      icon: Users,
      bgColor: "bg-blue-50",
      iconBgColor: "bg-blue-500",
      textColor: "text-blue-700",
      trend: { value: "+5%", isPositive: true },
      route: "/projects"
    },
    {
      title: "On Track",
      value: dashboard.active_projects?.filter((p: any) => p.healthStatus === "On Track").length ?? 0,
      subtitle: "Meeting targets",
      icon: CheckCircle,
      bgColor: "bg-emerald-50",
      iconBgColor: "bg-emerald-500",
      textColor: "text-emerald-700",
      trend: { value: "+5%", isPositive: true },
      route: "/projects?status=on-track"
    },
    {
      title: "At Risk",
      value: dashboard.active_projects?.filter((p: any) => p.healthStatus === "At Risk").length ?? 0,
      subtitle: "Need attention",
      icon: AlertTriangle,
      bgColor: "bg-amber-50",
      iconBgColor: "bg-amber-500",
      textColor: "text-amber-700",
      trend: { value: "-2%", isPositive: false },
      route: "/projects?status=at-risk"
    },
    {
      title: "Escalations",
      value: dashboard.escalations_count ?? 0,
      subtitle: "Requires action",
      icon: AlertCircle,
      bgColor: "bg-red-50",
      iconBgColor: "bg-red-500",
      textColor: "text-red-700",
      route: "/escalations"
    }
  ] : [];

  const handleKPIClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 animate-fade-in-up">
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
          onClick={() => handleKPIClick(kpi.route)}
          className="animate-scale-in"
          style={{ animationDelay: `${index * 0.1}s` } as any}
        />
      ))}
    </div>
  );
};
