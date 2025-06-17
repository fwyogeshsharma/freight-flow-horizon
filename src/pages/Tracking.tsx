
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Users } from "lucide-react";

const Tracking = () => {
  const activeShipments = [
    {
      id: "SH001",
      load: "LD001",
      driver: "Raj Kumar",
      vehicle: "TN01AB1234",
      from: "Mumbai",
      to: "Delhi",
      currentLocation: "Nashik",
      progress: 25,
      eta: "6 hours",
      status: "On Time"
    },
    {
      id: "SH002",
      load: "LD002", 
      driver: "Suresh Babu",
      vehicle: "KA02CD5678",
      from: "Chennai",
      to: "Bangalore",
      currentLocation: "Hosur",
      progress: 75,
      eta: "2 hours",
      status: "Delayed"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Live Tracking</h1>
          <p className="text-muted-foreground">Real-time shipment monitoring</p>
        </div>

        {/* Map Placeholder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Live Map View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600">Interactive Map</p>
                <p className="text-sm text-muted-foreground">Real-time vehicle tracking will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Shipments */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Shipments</h2>
          {activeShipments.map((shipment, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{shipment.id}</h3>
                    <p className="text-sm text-m uted-foreground">{shipment.load}</p>
                  </div>
                  <Badge variant={shipment.status === "On Time" ? "default" : "destructive"}>
                    {shipment.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      Driver
                    </p>
                    <p className="font-medium">{shipment.driver}</p>
                    <p className="text-xs text-muted-foreground">{shipment.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      Route
                    </p>
                    <p className="font-medium">{shipment.from} → {shipment.to}</p>
                    <p className="text-xs text-muted-foreground">Currently: {shipment.currentLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Truck className="h-3 w-3 mr-1" />
                      ETA
                    </p>
                    <p className="font-medium">{shipment.eta}</p>
                    <p className="text-xs text-muted-foreground">{shipment.progress}% Complete</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${shipment.progress}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
