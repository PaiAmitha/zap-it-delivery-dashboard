
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface PerformanceMetricsCardProps {
  resourceData: {
    utilizationRate: number;
    projectSuccessRate: number;
    performanceRating: number;
  };
}

export const PerformanceMetricsCard = ({ resourceData }: PerformanceMetricsCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Utilization Rate</span>
            <span className="font-medium">{resourceData.utilizationRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${resourceData.utilizationRate}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Project Success Rate</span>
            <span className="font-medium">{resourceData.projectSuccessRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${resourceData.projectSuccessRate}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Performance Rating</span>
            <div className="flex items-center gap-1">
              {renderStars(resourceData.performanceRating)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
