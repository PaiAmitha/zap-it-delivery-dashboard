
import { EnhancedKPICard } from "@/components/dashboard/EnhancedKPICard";
import { Users, UserCheck, UserX, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDashboard } from "@/lib/api";
export const ResourceKPISection = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<any>(null);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const data = await getDashboard(token);
        setDashboard(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchDashboard();
  }, []);

  const kpiData = dashboard ? [
    {
      title: "Total Resources",
      value: dashboard.total_resources,
      subtitle: "Active across all projects",
      icon: Users,
      bgColor: "bg-blue-50",
      iconBgColor: "bg-blue-500",
      textColor: "text-blue-700",
      linkTo: "/resource-management/total-resources",
      trend: { value: "+2.5%", isPositive: true }
    },
    {
      title: "Billable Resources",
      value: dashboard.billable_resources_count,
      subtitle: `${((dashboard.billable_resources_count / dashboard.total_resources) * 100).toFixed(1)}% billability rate`,
      icon: UserCheck,
// ...existing code...
      iconBgColor: "bg-emerald-500",
      textColor: "text-emerald-700",
      linkTo: "/resource-management/billable-resources",
      trend: { value: "+5.2%", isPositive: true }
    },
    {
      title: "Non-Billable Resources",
      value: dashboard.non_billable_resources_count,
      subtitle: `${((dashboard.non_billable_resources_count / dashboard.total_resources) * 100).toFixed(1)}% bench strength`,
      icon: UserX,
      bgColor: "bg-amber-50",
      iconBgColor: "bg-amber-500",
      textColor: "text-amber-700",
      linkTo: "/resource-management/non-billable-resources",
      trend: { value: "-1.2%", isPositive: false }
    },
    {
      title: "Interns",
      value: dashboard.total_interns,
      subtitle: `Conversion rate: ${dashboard.intern_conversion_rate || 0}%`,
      icon: GraduationCap,
      bgColor: "bg-purple-50",
      iconBgColor: "bg-purple-500",
      textColor: "text-purple-700",
      linkTo: "/resource-management/interns",
      trend: { value: "+0.8%", isPositive: true }
    }
  ] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {kpiData.map((kpi, index) => (
        <EnhancedKPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          subtitle={kpi.subtitle}
          trend={kpi.trend}
          icon={kpi.icon}
          bgColor={kpi.bgColor}
          iconBgColor={kpi.iconBgColor}
          textColor={kpi.textColor}
          onClick={() => navigate(kpi.linkTo)}
          className="animate-scale-in"
          style={{ animationDelay: `${index * 0.1}s` } as any}
        />
      ))}
    </div>
  );
}

