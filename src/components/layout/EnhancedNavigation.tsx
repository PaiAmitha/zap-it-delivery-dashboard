
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { GlobalDateFilter } from "./GlobalDateFilter";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import userData from "@/data/userData.json";

export const EnhancedNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { state, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const sidebarCollapsed = state === "collapsed";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
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
    <header className="nav-enhanced h-16 sm:h-20 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 bg-white/80 backdrop-blur-sm border-b border-border/50 transition-all duration-300 w-full sticky top-0 z-30">
      {/* Enhanced left section with mobile menu toggle */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 min-w-0 flex-1">
        {/* Mobile menu toggle */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {state === "expanded" ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Menu className="h-5 w-5 text-gray-700" />
            )}
          </Button>
        )}
        
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          {/* Logo with responsive sizing */}
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/a90c85f8-ec35-4fc0-8078-06c2363e005a.png" 
              alt="Zapcom Group" 
              className="h-5 sm:h-6 md:h-8 lg:h-10 transition-all duration-300 hover:scale-105 filter drop-shadow-sm"
            />
          </div>
          
          {/* Title section with responsive text */}
          <div className="hidden sm:flex flex-col min-w-0 justify-center">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-bold truncate leading-tight">
              IT Delivery Dashboard
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground truncate leading-tight hidden md:block">
              {isMobile ? "Project delivery" : "Executive overview of project delivery health and performance"}
            </p>
          </div>
          
          {/* Mobile title - shown only on small screens */}
          <div className="sm:hidden flex flex-col min-w-0 justify-center">
            <h1 className="text-xs font-bold text-primary truncate leading-tight">
              IT Dashboard
            </h1>
          </div>
        </div>
      </div>
      
      {/* Enhanced right section with responsive spacing */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 min-w-0">
        {/* Enhanced Date Filter with responsive container */}
        <div className="glass-subtle p-1 sm:p-2 md:p-3 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center">
          <GlobalDateFilter />
        </div>

        {/* Enhanced User Info section with responsive layout */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 min-w-0">
          {/* User details with enhanced responsive layout */}
          <div className="hidden sm:flex flex-col items-end min-w-0 justify-center">
            <div className="flex items-center gap-1 sm:gap-2 h-5 sm:h-6">
              <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">Welcome,</span>
              <span className="text-xs sm:text-sm md:text-base text-foreground font-semibold truncate max-w-16 sm:max-w-24 md:max-w-32 lg:max-w-none">
                {currentUser?.name || "User"}
              </span>
            </div>
            {currentUser?.role && (
              <div className="flex justify-end mt-1 sm:mt-2">
                <Badge className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground text-xs px-2 sm:px-3 py-1 rounded-full shadow-sm transition-all duration-300">
                  {currentUser.role}
                </Badge>
              </div>
            )}
          </div>
          
          {/* Mobile user info - compact version */}
          <div className="sm:hidden flex items-center">
            {currentUser?.role && (
              <Badge className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full shadow-sm mr-2">
                {currentUser.role}
              </Badge>
            )}
          </div>
          
          {/* Enhanced logout button with responsive sizing */}
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="btn-secondary-enhanced hover:shadow-lg focus-enhanced text-xs sm:text-sm font-semibold px-2 sm:px-3 md:px-4 py-2 sm:py-3 h-8 sm:h-10 md:h-12 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center"
            >
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
