
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MapPin, Truck, Clock, DollarSign, Users, Star, Filter } from "lucide-react";

const LoadMatchingDashboard = () => {
  const [selectedLoad, setSelectedLoad] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"proximity" | "rating" | "price">("proximity");

  const matchingLoads = [
    {
      id: "LD001",
      type: "Steel Coils",
      weight: "20 tons",
      from: "Mumbai",
      to: "Delhi",
      pickupDate: "2024-01-18",
      offeredPrice: "₹45,000",
      distance: "1,400 km",
      bidsReceived: 5,
      bestBid: "₹42,000",
      status: "Open",
      urgency: "Medium",
      factoryOwner: "Steel Corp Ltd.",
      routeMatch: 95,
      vehicleMatch: "Heavy Truck Required"
    },
    {
      id: "LD002",
      type: "Electronics",
      weight: "8 tons",
      from: "Chennai",
      to: "Bangalore",
      pickupDate: "2024-01-19",
      offeredPrice: "₹18,000",
      distance: "350 km",
      bidsReceived: 3,
      bestBid: "₹16,500",
      status: "Direct Booking",
      urgency: "High",
      factoryOwner: "Tech Solutions",
      routeMatch: 100,
      vehicleMatch: "Closed Body Required"
    }
  ];

  const availableFleets = [
    {
      id: "FL001",
      name: "Express Logistics",
      rating: 4.8,
      distance: "12 km",
      availableTrucks: 3,
      lastDelivery: "2 days ago",
      responseTime: "15 mins avg",
      completionRate: "98%",
      preferredRoutes: ["Mumbai-Delhi", "Mumbai-Pune"]
    },
    {
      id: "FL002", 
      name: "Reliable Transport",
      rating: 4.5,
      distance: "25 km",
      availableTrucks: 2,
      lastDelivery: "1 week ago",
      responseTime: "30 mins avg",
      completionRate: "95%",
      preferredRoutes: ["Chennai-Bangalore", "Chennai-Hyderabad"]
    }
  ];

  const handleDirectBooking = (loadId: string, fleetId: string) => {
    console.log(`Direct booking: Load ${loadId} to Fleet ${fleetId}`);
  };

  const handleAutoMatch = (loadId: string) => {
    console.log(`Auto-matching load ${loadId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Load Matching Dashboard</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
          <Input placeholder="Search loads..." className="w-64" />
        </div>
      </div>

      <Tabs defaultValue="matching" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="matching">Smart Matching</TabsTrigger>
          <TabsTrigger value="bidding">Active Bidding</TabsTrigger>
          <TabsTrigger value="direct">Direct Booking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="matching" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Loads */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Loads</h3>
              {matchingLoads.map((load) => (
                <Card key={load.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span>{load.id}</span>
                          <Badge variant={load.urgency === "High" ? "destructive" : "secondary"}>
                            {load.urgency}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{load.factoryOwner}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{load.offeredPrice}</div>
                        <div className="text-sm text-green-600">Best: {load.bestBid}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{load.from} → {load.to}</p>
                          <p className="text-xs text-muted-foreground">{load.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{load.type}</p>
                          <p className="text-xs text-muted-foreground">{load.weight}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">Route Match</span>
                      <span className="text-sm font-medium text-green-600">{load.routeMatch}%</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View Bids ({load.bidsReceived})</Button>
                      <Button size="sm" className="gradient-bg" onClick={() => handleAutoMatch(load.id)}>
                        Auto Match
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Available Fleets */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Matching Fleet Owners</h3>
              {availableFleets.map((fleet) => (
                <Card key={fleet.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{fleet.name}</CardTitle>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{fleet.rating}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{fleet.distance} away</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Available Trucks</span>
                        <span className="text-sm font-medium">{fleet.availableTrucks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Response Time</span>
                        <span className="text-sm font-medium">{fleet.responseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Completion Rate</span>
                        <span className="text-sm font-medium text-green-600">{fleet.completionRate}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View Profile</Button>
                      <Button size="sm" className="gradient-bg">
                        Direct Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bidding">
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold">Active Bidding</h3>
            <p className="text-muted-foreground">Bidding interface will be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="direct">
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold">Direct Booking</h3>
            <p className="text-muted-foreground">Direct booking interface will be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold">Matching Analytics</h3>
            <p className="text-muted-foreground">Performance analytics will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoadMatchingDashboard;
