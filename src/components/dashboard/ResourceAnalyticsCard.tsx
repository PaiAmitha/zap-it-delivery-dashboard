import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { ResourceDetailsModal } from "@/components/resource-management/ResourceDetailsModal";

interface SeniorityData {
  level: string;
  count: number;
  percentage: number;
  monthlyCost: number;
  ytdCost: number;
}

interface SkillData {
  category: string;
  count: number;
  monthlyCost: number;
}

interface AgingData {
  bucket: string;
  count: number;
  monthlyCost: number;
  avgDailyCost: number;
  riskLevel: "low" | "medium" | "high";
}

interface EngagementData {
  type: string;
  count: number;
  monthlyCost: number;
  startDate: string;
  endDate: string;
  notes: string;
}

interface ResourceAnalyticsProps {
  seniorityData: SeniorityData[];
  skillData: SkillData[];
  agingData: AgingData[];
  engagementData: EngagementData[];
}

export const ResourceAnalyticsCard = ({
  seniorityData,
  skillData,
  agingData,
  engagementData
}: ResourceAnalyticsProps) => {
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [modalType, setModalType] = useState<'seniority' | 'skill' | 'aging' | 'engagement'>('seniority');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getRiskColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (resource: any, type: 'seniority' | 'skill' | 'aging' | 'engagement') => {
    setSelectedResource(resource);
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Seniority Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Non-Billable Resources by Seniority
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seniority Level</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>% of Non-Billable</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>YTD Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seniorityData.map((item) => (
                <TableRow key={item.level}>
                  <TableCell className="font-medium">{item.level}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{item.percentage}%</TableCell>
                  <TableCell>{formatCurrency(item.monthlyCost)}</TableCell>
                  <TableCell>{formatCurrency(item.ytdCost)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(item, 'seniority')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Skill Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Non-Billable Resources by Skill Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Category</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillData.map((item) => (
                <TableRow key={item.category}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{formatCurrency(item.monthlyCost)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(item, 'skill')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Resources
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Aging Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-500" />
            Bench Aging Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aging Bucket</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Avg Daily Cost</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agingData.map((item) => (
                <TableRow key={item.bucket}>
                  <TableCell className="font-medium">{item.bucket}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{formatCurrency(item.monthlyCost)}</TableCell>
                  <TableCell>{formatCurrency(item.avgDailyCost)}</TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(item.riskLevel)}>
                      {item.riskLevel.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(item, 'aging')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Engagement Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Non-Billable by Engagement Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Engagement Type</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {engagementData.map((item) => (
                <TableRow key={item.type}>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{formatCurrency(item.monthlyCost)}</TableCell>
                  <TableCell>{item.startDate}</TableCell>
                  <TableCell>{item.endDate}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.notes}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(item, 'engagement')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ResourceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={selectedResource}
        type={modalType}
      />
    </div>
  );
};
