
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { GlobalDateFilter } from "@/components/layout/GlobalDateFilter";
import userData from "@/data/userData.json";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage (assuming login stores user info)
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      // Find matching user in userData.json by name
      const userDetails = userData.users.find(u => u.name === parsedUser.name);
      setCurrentUser(userDetails || parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b-4 border-blue-500 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/a90c85f8-ec35-4fc0-8078-06c2363e005a.png" 
            alt="Zapcom Group" 
            className="h-8"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <GlobalDateFilter />

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-gray-700 font-medium">Welcome, {currentUser?.name || "User"}</span>
            {currentUser?.role && (
              <div className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                {currentUser.role}
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};
