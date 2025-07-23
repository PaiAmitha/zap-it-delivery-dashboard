
import { UserHoverCard } from "@/components/ui/user-hover-card";

interface TeamMemberCardProps {
  member: {
    name: string;
    role: string;
    allocation?: string;
    status?: string;
    email?: string;
    department?: string;
    location?: string;
  };
  children: React.ReactNode;
}

export const TeamMemberCard = ({ member, children }: TeamMemberCardProps) => {
  // Generate email if not provided
  const email = member.email || `${member.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
  
  // Default values for required props
  const department = member.department || "Engineering";
  const location = member.location || "Remote";

  return (
    <UserHoverCard
      name={member.name}
      role={member.role}
      department={department}
      location={location}
      email={email}
    >
      {children}
    </UserHoverCard>
  );
};
