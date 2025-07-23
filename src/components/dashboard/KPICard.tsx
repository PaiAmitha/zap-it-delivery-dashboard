
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  linkTo?: string;
}

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = "text-blue-500",
  bgColor = "bg-blue-50",
  trend,
  linkTo = "#"
}: KPICardProps) => {
  const CardContent = () => (
    <div className={`${bgColor} rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`${iconColor} ml-4`}>
          <Icon size={32} />
        </div>
      </div>
    </div>
  );

  return linkTo === "#" ? (
    <CardContent />
  ) : (
    <Link to={linkTo}>
      <CardContent />
    </Link>
  );
};
