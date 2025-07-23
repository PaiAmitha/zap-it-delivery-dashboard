
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DevelopmentMetricsCards } from "./cards/DevelopmentMetricsCards";
import { QAMetricsCards } from "./cards/QAMetricsCards";
import { SprintVelocityChart } from "./charts/SprintVelocityChart";
import { DefectLeakageChart } from "./charts/DefectLeakageChart";

export const EngineeringTabs = () => {
  const [activeTab, setActiveTab] = useState("development");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab("development")}
          className={`px-4 py-2 border-b-2 font-medium ${
            activeTab === "development" 
              ? "border-blue-500 text-blue-600" 
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Development Metrics
        </button>
        <button 
          onClick={() => setActiveTab("qa")}
          className={`px-4 py-2 border-b-2 font-medium ${
            activeTab === "qa" 
              ? "border-blue-500 text-blue-600" 
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          QA Metrics
        </button>
      </div>

      {/* Development Metrics Tab */}
      {activeTab === "development" && (
        <div className="space-y-6">
          {/* Development Metrics Cards */}
          <DevelopmentMetricsCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Quality & Deployment */}
            <Card>
              <CardHeader>
                <CardTitle>Code Quality & Deployment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Code Quality Score</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">8.7/10</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">Excellent</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Deployment Frequency</span>
                    <span className="font-medium">12/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lead Time for Changes</span>
                    <span className="font-medium">2.3 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Development Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Development Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Code Review Coverage</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Technical Debt Ratio</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Sprint Goal Achievement</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Quality Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  [Code Quality Trend Chart Placeholder]
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment Frequency Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  [Deployment Frequency Trend Chart Placeholder]
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* QA Metrics Tab */}
      {activeTab === "qa" && (
        <div className="space-y-6">
          {/* QA Metrics Cards */}
          <QAMetricsCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Defect Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Defect Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Defect Density</span>
                    <span className="font-medium">0.8 defects/KLOC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Regression Count</span>
                    <span className="font-medium">2 (last 3 cycles)</span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Defects by Severity</span>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">Critical</span>
                        </div>
                        <span className="font-medium">1</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">High</span>
                        </div>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Medium</span>
                        </div>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Low</span>
                        </div>
                        <span className="font-medium">12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Test Coverage</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Automation Coverage</span>
                      <span className="font-medium">73%</span>
                    </div>
                    <Progress value={73} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Test Execution Rate</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Coverage Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Test Coverage Trend (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                [Test Coverage Trend Chart Placeholder]
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
