
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SkillsExpertiseCardProps {
  skills: string[];
}

export const SkillsExpertiseCard = ({ skills }: SkillsExpertiseCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Expertise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-blue-700 border-blue-200">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
