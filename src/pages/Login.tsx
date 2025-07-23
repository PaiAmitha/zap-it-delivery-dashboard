
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { login } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result && result.token && result.user) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify({
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          isAuthenticated: true
        }));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.user.name}!`,
        });
        navigate("/");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err?.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="text-center pb-6 sm:pb-8 px-4 sm:px-6">
            <div className="mb-4 sm:mb-6">
              <img 
                src="/lovable-uploads/a90c85f8-ec35-4fc0-8078-06c2363e005a.png" 
                alt="Zapcom Group" 
                className="h-12 sm:h-16 mx-auto"
              />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
              IT Delivery Dashboard
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2 text-sm sm:text-base">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 sm:h-12 px-3 sm:px-4 border-gray-300 focus:border-primary focus:ring-primary text-sm sm:text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium text-sm sm:text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 sm:h-12 px-3 sm:px-4 border-gray-300 focus:border-primary focus:ring-primary text-sm sm:text-base"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-white font-medium text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Demo Credentials:
              </p>
              <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                <div className="grid grid-cols-1 gap-1">
                  <div>HR: hr@zapcg.com / hr123</div>
                  <div>Manager: manager@zapcg.com / manager123</div>
                  <div>CEO: ceo@zapcg.com / Leadership@123</div>
                  <div>CIO: cio@zapcg.com / Leadership@123</div>
                  <div>CTO: cto@zapcg.com / Leadership@123</div>
                  <div>EM: santhanakrishnan.b@zapcg.com / EM123</div>
                  <div>Finance: sushama.mohandasan@zapcg.com / Finance123</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
