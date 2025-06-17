
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Truck, Users, Settings, MapPin } from "lucide-react";

const Fleet = () => {
  const vehicles = [
    {
      id: "TN01AB1234",
      type: "Heavy Truck",
      capacity: "25 tons",
      driver: "Raj Kumar",
      status: "Available",
      location: "Mumbai"
    },
    {
      id: "KA02CD5678", 
      type: "Medium Truck",
      capacity: "15 tons",
      driver: "Suresh Babu",
      status: "In Transit",
      location: "Pune"
    },
    {
      id: "MH03EF9012",
      type: "Light Truck",
      capacity: "5 tons", 
      driver: "Amit Singh",
      status: "Maintenance",
      location: "Delhi"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
            <p className="text-muted-foreground">Manage your vehicles and drivers</p>
          </div>
          <Button className="gradient-bg">
            <Truck className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <Input
            placeholder="Search vehicles by plate number, driver, or location..."
            className="max-w-md"
          />
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{vehicle.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                  </div>
                  <Badge variant={
                    vehicle.status === "Available" ? "default" :
                    vehicle.status === "In Transit" ? "secondary" : "outline"
                  }>
                    {vehicle.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Capacity</span>
                    <span className="text-sm font-medium">{vehicle.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Driver</span>
                    <span className="text-sm font-medium">{vehicle.driver}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-medium flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {vehicle.location}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-3 w-3 mr-1" />
                    Driver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fleet;
