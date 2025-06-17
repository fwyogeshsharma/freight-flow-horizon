
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Truck, User, MapPin, Clock, DollarSign } from "lucide-react";

interface CarrierResponse {
  id: string;
  carrierName: string;
  rating: number;
  totalRating: number;
  quotedPrice: number;
  estimatedTime: string;
  truckType: string;
  truckNumber: string;
  driverName: string;
  driverPhoto?: string;
  distance: string;
  responseTime: string;
  verified: boolean;
}

const CarrierResponses = ({ loadId }: { loadId: string }) => {
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "time">("price");

  const responses: CarrierResponse[] = [
    {
      id: "1",
      carrierName: "Mumbai Transport Co.",
      rating: 4.8,
      totalRating: 156,
      quotedPrice: 25000,
      estimatedTime: "8 hours",
      truckType: "Heavy Truck",
      truckNumber: "MH01AB1234",
      driverName: "Raj Kumar",
      distance: "45 km away",
      responseTime: "2 mins ago",
      verified: true
    },
    {
      id: "2",
      carrierName: "Express Logistics",
      rating: 4.5,
      totalRating: 89,
      quotedPrice: 23500,
      estimatedTime: "10 hours",
      truckType: "Container",
      truckNumber: "GJ05CD5678",
      driverName: "Suresh Patel",
      distance: "12 km away",
      responseTime: "5 mins ago",
      verified: true
    },
    {
      id: "3",
      carrierName: "Reliable Freight",
      rating: 4.2,
      totalRating: 234,
      quotedPrice: 27000,
      estimatedTime: "6 hours",
      truckType: "Heavy Truck",
      truckNumber: "KA03EF9012",
      driverName: "Amit Singh",
      distance: "8 km away",
      responseTime: "12 mins ago",
      verified: false
    }
  ];

  const sortedResponses = [...responses].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.quotedPrice - b.quotedPrice;
      case "rating":
        return b.rating - a.rating;
      case "time":
        return parseInt(a.estimatedTime) - parseInt(b.estimatedTime);
      default:
        return 0;
    }
  });

  const handleAssignCarrier = (carrierId: string) => {
    setSelectedCarrier(carrierId);
    console.log(`Assigned carrier ${carrierId} to load ${loadId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Carrier Responses ({responses.length})</h2>
        <div className="flex space-x-2">
          <Button
            variant={sortBy === "price" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("price")}
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Price
          </Button>
          <Button
            variant={sortBy === "rating" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("rating")}
          >
            <Star className="h-4 w-4 mr-1" />
            Rating
          </Button>
          <Button
            variant={sortBy === "time" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("time")}
          >
            <Clock className="h-4 w-4 mr-1" />
            Time
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedResponses.map((response) => (
          <Card key={response.id} className={`hover:shadow-lg transition-shadow ${selectedCarrier === response.id ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={response.driverPhoto} />
                    <AvatarFallback>
                      {response.carrierName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{response.carrierName}</span>
                      {response.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{response.rating}</span>
                      <span>({response.totalRating} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ₹{response.quotedPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {response.responseTime}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{response.truckType}</p>
                    <p className="text-xs text-muted-foreground">{response.truckNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{response.driverName}</p>
                    <p className="text-xs text-muted-foreground">Driver</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{response.distance}</p>
                    <p className="text-xs text-muted-foreground">From pickup</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{response.estimatedTime}</p>
                    <p className="text-xs text-muted-foreground">Est. delivery</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
                <Button variant="outline" size="sm">
                  Counter Offer
                </Button>
                <Button 
                  size="sm" 
                  className="gradient-bg"
                  onClick={() => handleAssignCarrier(response.id)}
                  disabled={selectedCarrier !== null}
                >
                  {selectedCarrier === response.id ? "Assigned" : "Assign Carrier"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CarrierResponses;
