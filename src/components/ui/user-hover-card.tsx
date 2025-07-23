
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Building, Mail } from "lucide-react";

interface UserHoverCardProps {
  children: React.ReactNode;
  name: string;
  role: string;
  department: string;
  location: string;
  avatarSrc?: string;
  email?: string;
}

export const UserHoverCard = ({
  children,
  name,
  role,
  department,
  location,
  avatarSrc,
  email
}: UserHoverCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate email if not provided
  const displayEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}@company.com`;

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 shadow-lg border-gray-200" side="top" align="start">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
              <AvatarImage src={avatarSrc} alt={name} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{name}</h4>
              <p className="text-sm text-gray-600 truncate">{role}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 truncate">{displayEmail}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">{department}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">{location}</span>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              Active Employee
            </Badge>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
