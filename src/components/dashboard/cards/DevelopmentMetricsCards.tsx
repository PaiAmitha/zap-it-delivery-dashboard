
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Code2, GitCommit } from "lucide-react";

export const DevelopmentMetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Commits per Developer */}
      <Card>
        <CardContent className="p-6 text-center">
          <GitCommit className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">8.5</div>
          <div className="text-sm text-gray-600">Commits/Developer</div>
          <div className="text-xs text-gray-500">per day average</div>
          <div className="flex items-center justify-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-green-600">+12%</span>
          </div>
        </CardContent>
      </Card>

      {/* PR Merge Time */}
      <Card>
        <CardContent className="p-6 text-center">
          <Code2 className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">4.2h</div>
          <div className="text-sm text-gray-600">PR Merge Time</div>
          <div className="text-xs text-gray-500">average</div>
          <div className="flex items-center justify-center mt-2">
            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-green-600">-8%</span>
          </div>
        </CardContent>
      </Card>

      {/* Code Review Coverage */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-gray-900">94%</div>
          <div className="text-sm text-gray-600">Code Review Coverage</div>
          <div className="text-xs text-gray-500">PRs reviewed</div>
          <Progress value={94} className="mt-2" />
          <Badge variant="default" className="mt-2 bg-green-100 text-green-800">Excellent</Badge>
        </CardContent>
      </Card>
    </div>
  );
};
