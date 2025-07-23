
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TestTube, Bug, CheckCircle } from "lucide-react";

export const QAMetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Test Coverage */}
      <Card>
        <CardContent className="p-6 text-center">
          <TestTube className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">87%</div>
          <div className="text-sm text-gray-600">Test Coverage</div>
          <div className="text-xs text-gray-500">code coverage</div>
          <Progress value={87} className="mt-2" />
          <div className="flex items-center justify-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-green-600">+5%</span>
          </div>
        </CardContent>
      </Card>

      {/* Automation Coverage */}
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">73%</div>
          <div className="text-sm text-gray-600">Automation Coverage</div>
          <div className="text-xs text-gray-500">automated tests</div>
          <Progress value={73} className="mt-2" />
          <Badge variant="secondary" className="mt-2">Good</Badge>
        </CardContent>
      </Card>

      {/* Test Execution Rate */}
      <Card>
        <CardContent className="p-6 text-center">
          <Bug className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">95%</div>
          <div className="text-sm text-gray-600">Test Execution Rate</div>
          <div className="text-xs text-gray-500">tests executed</div>
          <Progress value={95} className="mt-2" />
          <Badge variant="default" className="mt-2 bg-purple-100 text-purple-800">Excellent</Badge>
        </CardContent>
      </Card>
    </div>
  );
};
