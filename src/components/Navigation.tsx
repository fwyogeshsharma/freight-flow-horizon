
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Users, FileText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/dashboard", icon: MapPin, label: "Dashboard" },
    { path: "/loads", icon: FileText, label: "Loads" },
    { path: "/fleet", icon: Truck, label: "Fleet" },
    { path: "/tracking", icon: MapPin, label: "Tracking" },
    { path: "/profile", icon: Users, label: "Profile" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/c87cccc8-4a41-4828-aabc-8d6ec84fc323.png" 
                alt="RollingRadius" 
                className="h-8 w-auto"
              />
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
