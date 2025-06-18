
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Truck, Clock, DollarSign, Send, MessageSquare } from "lucide-react";

interface Load {
  id: string;
  type: string;
  weight: string;
  from: string;
  to: string;
  pickupDate: string;
  offeredPrice: string;
  distance: string;
  factoryOwner: string;
  requirements: string;
  urgency: string;
}

const BiddingInterface = () => {
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [selectedTruck, setSelectedTruck] = useState("");
  const [bidNotes, setBidNotes] = useState("");

  const availableLoads: Load[] = [
    {
      id: "LD001",
      type: "Steel Coils",
      weight: "20 tons",
      from: "Mumbai",
      to: "Delhi",
      pickupDate: "2024-01-18",
      offeredPrice: "₹45,000",
      distance: "1,400 km",
      factoryOwner: "Steel Corp Ltd.",
      requirements: "Heavy Truck, Proper securing required",
      urgency: "Medium"
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
      factoryOwner: "Tech Solutions",
      requirements: "Closed body, Handle with care",
      urgency: "High"
    }
  ];

  const myTrucks = [
    { id: "TN01AB1234", type: "Heavy Truck", capacity: "25 tons", driver: "Raj Kumar" },
    { id: "KA02CD5678", type: "Container", capacity: "20 tons", driver: "Suresh Babu" }
  ];

  const myBids = [
    {
      loadId: "LD003",
      bidAmount: "₹32,000",
      status: "Pending",
      submittedAt: "2 hours ago",
      validUntil: "6 hours",
      factoryOwner: "Chemical Industries"
    },
    {
      loadId: "LD004",
      bidAmount: "₹15,000",
      status: "Accepted",
      submittedAt: "1 day ago",
      validUntil: "Accepted",
      factoryOwner: "FMCG Corp"
    }
  ];

  const handleSubmitBid = () => {
    if (!selectedLoad || !bidAmount || !estimatedTime) return;
    
    console.log("Submitting bid:", {
      loadId: selectedLoad.id,
      bidAmount,
      estimatedTime,
      selectedTruck,
      bidNotes
    });
    
    // Reset form
    setBidAmount("");
    setEstimatedTime("");
    setSelectedTruck("");
    setBidNotes("");
    setSelectedLoad(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Bidding Interface</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">My Bids</Button>
          <Button variant="outline" size="sm">Bid History</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Loads */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Available Loads for Bidding</h3>
          {availableLoads.map((load) => (
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
                    <div className="text-sm text-muted-foreground">Max Budget</div>
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
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Requirements:</p>
                  <p className="text-sm">{load.requirements}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gradient-bg" onClick={() => setSelectedLoad(load)}>
                        <DollarSign className="h-3 w-3 mr-1" />
                        Submit Bid
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Submit Bid for {load.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Your Bid Amount</label>
                          <Input
                            placeholder="Enter amount"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Estimated Delivery Time</label>
                          <Input
                            placeholder="e.g., 24 hours"
                            value={estimatedTime}
                            onChange={(e) => setEstimatedTime(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Select Truck</label>
                          <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose truck" />
                            </SelectTrigger>
                            <SelectContent>
                              {myTrucks.map((truck) => (
                                <SelectItem key={truck.id} value={truck.id}>
                                  {truck.id} - {truck.type} ({truck.capacity})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Notes (Optional)</label>
                          <Textarea
                            placeholder="Additional details..."
                            value={bidNotes}
                            onChange={(e) => setBidNotes(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleSubmitBid} className="w-full gradient-bg">
                          <Send className="h-4 w-4 mr-2" />
                          Submit Bid
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Active Bids */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">My Active Bids</h3>
          {myBids.map((bid, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{bid.loadId}</CardTitle>
                  <Badge variant={
                    bid.status === "Accepted" ? "default" :
                    bid.status === "Pending" ? "secondary" : "destructive"
                  }>
                    {bid.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bid Amount</span>
                    <span className="text-sm font-medium">{bid.bidAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Submitted</span>
                    <span className="text-sm">{bid.submittedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valid Until</span>
                    <span className="text-sm">{bid.validUntil}</span>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Chat
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

export default BiddingInterface;
