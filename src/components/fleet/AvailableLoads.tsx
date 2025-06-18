
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Truck, Clock, DollarSign } from "lucide-react";

const AvailableLoads = () => {
  const availableLoads = [
    {
      id: "AL001",
      loadId: "LD004",
      type: "Electronics",
      weight: "12 tons",
      from: "Mumbai",
      to: "Pune",
      pickupDate: "2024-01-18",
      offeredPrice: "₹18,000",
      distance: "148 km",
      estimatedTime: "4 hours",
      factoryOwner: "Tech Components Ltd.",
      requiredTruckType: "Closed Body",
      urgency: "Medium"
    },
    {
      id: "AL002",
      loadId: "LD005",
      type: "Steel Coils",
      weight: "28 tons",
      from: "Chennai",
      to: "Coimbatore", 
      pickupDate: "2024-01-19",
      offeredPrice: "₹35,000",
      distance: "342 km",
      estimatedTime: "7 hours",
      factoryOwner: "Steel Industries Corp.",
      requiredTruckType: "Open Body",
      urgency: "High"
    },
    {
      id: "AL003",
      loadId: "LD006",
      type: "Chemicals",
      weight: "15 tons",
      from: "Bangalore",
      to: "Hyderabad",
      pickupDate: "2024-01-20",
      offeredPrice: "₹28,000",
      distance: "562 km",
      estimatedTime: "9 hours",
      factoryOwner: "Chemical Solutions Pvt Ltd.",
      requiredTruckType: "Tanker",
      urgency: "Low"
    }
  ];

  const handleSubmitQuote = (loadId: string) => {
    console.log(`Submitting quote for load ${loadId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Loads ({availableLoads.length})</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Filter by Route
          </Button>
          <Button variant="outline" size="sm">
            Filter by Truck Type
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {availableLoads.map((load, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{load.loadId}</span>
                    <Badge variant={
                      load.urgency === "High" ? "destructive" :
                      load.urgency === "Medium" ? "secondary" : "outline"
                    }>
                      {load.urgency} Priority
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{load.factoryOwner}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{load.offeredPrice}</div>
                  <div className="text-sm text-muted-foreground">Offered Price</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{load.type}</p>
                    <p className="text-xs text-muted-foreground">{load.weight}</p>
                  </div>
                </div>
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
                    <p className="text-sm font-medium">{load.requiredTruckType}</p>
                    <p className="text-xs text-muted-foreground">Required</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{load.pickupDate}</p>
                    <p className="text-xs text-muted-foreground">{load.estimatedTime}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Counter Offer
                </Button>
                <Button 
                  size="sm" 
                  className="gradient-bg"
                  onClick={() => handleSubmitQuote(load.loadId)}
                >
                  Submit Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableLoads;
