
import { EnhancedKPICard } from "@/components/dashboard/EnhancedKPICard";
import { Users, UserCheck, UserX, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ResourceKPISection = () => {
  const navigate = useNavigate();

  const kpiData = [
    { 
      title: "Total Resources", 
      value: 142, 
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
      value: 89, 
      subtitle: "62.7% billability rate", 
      icon: UserCheck, 
      bgColor: "bg-emerald-50",
      iconBgColor: "bg-emerald-500",
      textColor: "text-emerald-700",
      linkTo: "/resource-management/billable-resources",
      trend: { value: "+5.2%", isPositive: true }
    },
    { 
      title: "Non-Billable Resources", 
      value: 45, 
      subtitle: "31.7% bench strength", 
      icon: UserX, 
      bgColor: "bg-amber-50",
      iconBgColor: "bg-amber-500",
      textColor: "text-amber-700",
      linkTo: "/resource-management/non-billable-resources",
      trend: { value: "15 in training", isPositive: false }
    },
    { 
      title: "Interns", 
      value: 8, 
      subtitle: "75% conversion rate", 
      icon: GraduationCap, 
      bgColor: "bg-purple-50",
      iconBgColor: "bg-purple-500",
      textColor: "text-purple-700",
      linkTo: "/resource-management/interns",
      trend: { value: "3 converting", isPositive: true }
    },
  ];

  const handleKPIClick = (linkTo: string) => {
    navigate(linkTo);
  };

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
          onClick={() => handleKPIClick(kpi.linkTo)}
          className="animate-scale-in"
          style={{ animationDelay: `${index * 0.1}s` } as any}
        />
      ))}
    </div>
  );
};
