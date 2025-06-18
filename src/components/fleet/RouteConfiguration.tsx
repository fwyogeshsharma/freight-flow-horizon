
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MapPin, Calendar, Truck } from "lucide-react";

const RouteConfiguration = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [routes] = useState([
    {
      id: "R001",
      name: "Mumbai-Delhi Corridor",
      source: "Mumbai, Maharashtra",
      destination: "Delhi, NCR",
      distance: "1,424 km",
      estimatedTime: "18-20 hours",
      viaPoints: ["Surat", "Udaipur", "Jaipur"],
      assignedTrucks: ["TN01AB1234", "MH03EF9012"],
      status: "Active",
      frequency: "Daily"
    },
    {
      id: "R002",
      name: "Chennai-Bangalore Express",
      source: "Chennai, Tamil Nadu",
      destination: "Bangalore, Karnataka",
      distance: "346 km",
      estimatedTime: "6-8 hours",
      viaPoints: ["Hosur"],
      assignedTrucks: ["KA02CD5678"],
      status: "Active",
      frequency: "Weekly"
    }
  ]);

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Route Configuration</h2>
        <Button 
          className="gradient-bg"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Route
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Configure New Route</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRoute} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routeName">Route Name</Label>
                <Input id="routeName" placeholder="e.g., Mumbai-Delhi Corridor" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceLocation">Source Location</Label>
                  <Input id="sourceLocation" placeholder="City, State" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destinationLocation">Destination Location</Label>
                  <Input id="destinationLocation" placeholder="City, State" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="viaPoints">Via Points (Optional)</Label>
                <Input id="viaPoints" placeholder="e.g., Surat, Udaipur, Jaipur (comma separated)" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedDistance">Estimated Distance (km)</Label>
                  <Input id="estimatedDistance" type="number" placeholder="1424" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
                  <Input id="estimatedTime" placeholder="18-20" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Availability Schedule</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="gradient-bg">
                  Add Route
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Route List */}
      <div className="space-y-4">
        {routes.map((route, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{route.name}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {route.source} → {route.destination}
                  </p>
                </div>
                <Badge variant={route.status === "Active" ? "default" : "secondary"}>
                  {route.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-medium">{route.distance}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Est. Time</p>
                  <p className="font-medium">{route.estimatedTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Frequency</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {route.frequency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Trucks</p>
                  <p className="font-medium flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    {route.assignedTrucks.length} trucks
                  </p>
                </div>
              </div>

              {route.viaPoints.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Via Points</p>
                  <div className="flex space-x-2 mt-1">
                    {route.viaPoints.map((point, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {point}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Edit Route
                </Button>
                <Button variant="outline" size="sm">
                  Assign Trucks
                </Button>
                <Button variant="outline" size="sm">
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RouteConfiguration;
