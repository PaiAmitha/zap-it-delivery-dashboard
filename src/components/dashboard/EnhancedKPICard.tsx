
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnhancedKPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  bgColor: string;
  iconBgColor: string;
  textColor?: string;
  onClick?: () => void;
}

export const EnhancedKPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  bgColor,
  iconBgColor,
  textColor = "text-slate-700",
  className,
  onClick,
  ...props
}: EnhancedKPICardProps) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-0",
        bgColor,
        className
      )}
      onClick={onClick}
      {...props}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Icon */}
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            iconBgColor
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <p className={cn("text-sm font-medium", textColor)}>
              {title}
            </p>
            
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900">
                {value}
              </h3>
              {subtitle && (
                <span className={cn("text-sm", textColor)}>
                  {subtitle}
                </span>
              )}
            </div>
            
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isPositive ? "text-emerald-600" : "text-red-500"
              )}>
                <span>{trend.isPositive ? "↗" : "↘"}</span>
                <span>{trend.value}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
