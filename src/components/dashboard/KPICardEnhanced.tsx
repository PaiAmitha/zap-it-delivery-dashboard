import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface KPICardEnhancedProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconColor?: string;
  bgColor?: string;
}

export const KPICardEnhanced = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  iconColor = "text-blue-600",
  bgColor = "bg-white"
}: KPICardEnhancedProps) => {
  const IconComponent = (Icons as any)[icon] as LucideIcon;

  return (
    <div className={`${bgColor} rounded-lg shadow-sm border border-border p-6 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer`}>
      <div className="flex items-center justify-center mb-3">
        <IconComponent className={`h-8 w-8 ${iconColor}`} />
      </div>
      <div className="text-center space-y-1">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-sm font-medium text-foreground">{title}</div>
        {subtitle && (
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        )}
      </div>
    </div>
  );
};