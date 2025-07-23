
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";

interface PerformanceFeedback {
  reviewer: string;
  date: string;
  rating: number;
  comment: string;
  strengths: string[];
  improvements: string[];
  goals: string[];
}

interface PerformanceFeedbackCardProps {
  feedback: PerformanceFeedback;
}

export const PerformanceFeedbackCard = ({ feedback }: PerformanceFeedbackCardProps) => {
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
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Performance Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">{feedback.reviewer}</h4>
              <p className="text-sm text-gray-500">{feedback.date}</p>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(feedback.rating)}
            </div>
          </div>
          
          <p className="text-gray-700">{feedback.comment}</p>
          
          <div>
            <h5 className="font-medium text-sm text-gray-700 mb-2">Strengths:</h5>
            <div className="flex flex-wrap gap-1">
              {feedback.strengths.map((strength, index) => (
                <Badge key={index} variant="outline" className="text-green-700 border-green-200">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-sm text-gray-700 mb-2">Areas for Improvement:</h5>
            <div className="flex flex-wrap gap-1">
              {feedback.improvements.map((improvement, index) => (
                <Badge key={index} variant="outline" className="text-orange-700 border-orange-200">
                  {improvement}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-sm text-gray-700 mb-2">Goals:</h5>
            <div className="flex flex-wrap gap-1">
              {feedback.goals.map((goal, index) => (
                <Badge key={index} variant="outline" className="text-blue-700 border-blue-200">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
