
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, FileText, MapPin, Users, ArrowUp, ArrowDown } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Active Loads",
      value: "24",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Fleet Vehicles",
      value: "156",
      change: "+3%",
      icon: Truck,
      color: "text-green-600"
    },
    {
      title: "Active Drivers",
      value: "89",
      change: "+8%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "In Transit",
      value: "47",
      change: "-2%",
      icon: MapPin,
      color: "text-orange-600"
    }
  ];

  const recentLoads = [
    {
      id: "LD001",
      from: "Mumbai",
      to: "Delhi",
      status: "In Transit",
      driver: "Raj Kumar",
      eta: "2 hours"
    },
    {
      id: "LD002", 
      from: "Chennai",
      to: "Bangalore",
      status: "Loading",
      driver: "Suresh Babu",
      eta: "4 hours"
    },
    {
      id: "LD003",
      from: "Pune",
      to: "Hyderabad", 
      status: "Delivered",
      driver: "Amit Singh",
      eta: "Completed"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your logistics operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.change.startsWith('+') ? (
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Loads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Loads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLoads.map((load, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="font-semibold">{load.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {load.from} → {load.to}
                    </div>
                    <Badge variant={
                      load.status === "Delivered" ? "default" :
                      load.status === "In Transit" ? "secondary" : "outline"
                    }>
                      {load.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{load.driver}</div>
                    <div className="text-xs text-muted-foreground">ETA: {load.eta}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Loads
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
