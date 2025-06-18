
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Users, Clock, AlertTriangle } from "lucide-react";

const LiveTracking = () => {
  const activeTrips = [
    {
      id: "T001",
      loadId: "LD001",
      truck: "TN01AB1234",
      driver: "Raj Kumar",
      route: "Mumbai → Delhi",
      currentLocation: "Nashik, Maharashtra",
      progress: 25,
      speed: "65 km/h",
      eta: "14:30 Tomorrow",
      status: "On Time",
      lastUpdate: "2 mins ago",
      alerts: []
    },
    {
      id: "T002",
      loadId: "LD002",
      truck: "KA02CD5678",
      driver: "Suresh Babu",
      route: "Chennai → Bangalore",
      currentLocation: "Hosur Border",
      progress: 85,
      speed: "45 km/h",
      eta: "16:45 Today",
      status: "Delayed",
      lastUpdate: "5 mins ago",
      alerts: ["Long idle time detected"]
    },
    {
      id: "T003",
      loadId: "LD003",
      truck: "MH03EF9012",
      driver: "Amit Singh",
      route: "Pune → Hyderabad",
      currentLocation: "Solapur, Maharashtra",
      progress: 45,
      speed: "72 km/h",
      eta: "09:15 Tomorrow",
      status: "On Time",
      lastUpdate: "1 min ago",
      alerts: ["Overspeeding alert"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Live Fleet Tracking</h2>
        <Badge variant="secondary">{activeTrips.length} Active Trips</Badge>
      </div>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Map View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">Interactive Fleet Map</p>
              <p className="text-sm text-muted-foreground">Real-time vehicle positions and routes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Trips */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Shipments</h3>
        {activeTrips.map((trip, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold flex items-center space-x-2">
                    <span>{trip.id}</span>
                    <Badge variant="outline">{trip.loadId}</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground">{trip.route}</p>
                </div>
                <div className="text-right">
                  <Badge variant={trip.status === "On Time" ? "default" : "destructive"}>
                    {trip.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{trip.lastUpdate}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{trip.truck}</p>
                    <p className="text-xs text-muted-foreground">Vehicle</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{trip.driver}</p>
                    <p className="text-xs text-muted-foreground">Driver</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{trip.currentLocation}</p>
                    <p className="text-xs text-muted-foreground">Current Location</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{trip.eta}</p>
                    <p className="text-xs text-muted-foreground">ETA</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{trip.progress}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trip.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Speed and Alerts */}
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-muted-foreground">Current Speed: </span>
                  <span className="font-medium">{trip.speed}</span>
                </div>
                {trip.alerts.length > 0 && (
                  <div className="flex items-center text-amber-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{trip.alerts[0]}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveTracking;
