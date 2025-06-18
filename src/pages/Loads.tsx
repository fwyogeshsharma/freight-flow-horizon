
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MapPin, Truck, Plus } from "lucide-react";
import { useState } from "react";
import PostNewLoad from "@/components/loads/PostNewLoad";
import CarrierResponses from "@/components/loads/CarrierResponses";
import LoadMatchingDashboard from "@/components/bidding/LoadMatchingDashboard";
import BiddingInterface from "@/components/bidding/BiddingInterface";

const Loads = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLoad, setSelectedLoad] = useState<string | null>(null);

  const loads = [
    {
      id: "LD001",
      type: "Steel Coils",
      weight: "20 tons",
      from: "Mumbai",
      to: "Delhi", 
      pickupDate: "2024-01-15",
      status: "Open",
      quotes: 3
    },
    {
      id: "LD002",
      type: "Electronics",
      weight: "8 tons",
      from: "Chennai",
      to: "Bangalore",
      pickupDate: "2024-01-16", 
      status: "Assigned",
      quotes: 5
    },
    {
      id: "LD003",
      type: "Chemicals",
      weight: "15 tons",
      from: "Pune",
      to: "Hyderabad",
      pickupDate: "2024-01-17",
      status: "In Transit", 
      quotes: 2
    }
  ];

  const handleViewQuotes = (loadId: string) => {
    setSelectedLoad(loadId);
    setActiveTab("responses");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Load Management</h1>
            <p className="text-muted-foreground">Post and manage freight loads</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="post-load">Post New Load</TabsTrigger>
            <TabsTrigger value="responses">Carrier Responses</TabsTrigger>
            <TabsTrigger value="matching">Load Matching</TabsTrigger>
            <TabsTrigger value="bidding">Bidding System</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Search and Filter */}
            <div className="mb-6">
              <Input
                placeholder="Search loads by ID, type, or destination..."
                className="max-w-md"
              />
            </div>

            {/* Load Cards */}
            <div className="space-y-4">
              {loads.map((load, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{load.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">{load.type}</p>
                      </div>
                      <Badge variant={
                        load.status === "Open" ? "outline" :
                        load.status === "Assigned" ? "secondary" : "default"
                      }>
                        {load.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-medium">{load.weight}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Route</p>
                        <p className="font-medium flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {load.from} → {load.to}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup Date</p>
                        <p className="font-medium">{load.pickupDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quotes</p>
                        <p className="font-medium">{load.quotes} received</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewQuotes(load.id)}
                      >
                        <Truck className="h-3 w-3 mr-1" />
                        View Quotes
                      </Button>
                      {load.status === "Open" && (
                        <Button size="sm" className="gradient-bg">
                          Assign Carrier
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button className="mt-4 gradient-bg" onClick={() => setActiveTab("post-load")}>
              <Plus className="h-4 w-4 mr-2" />
              Post New Load
            </Button>
          </TabsContent>

          <TabsContent value="post-load">
            <PostNewLoad />
          </TabsContent>

          <TabsContent value="responses">
            {selectedLoad ? (
              <CarrierResponses loadId={selectedLoad} />
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
                <h2 className="mt-4 text-lg font-semibold">No Load Selected</h2>
                <p className="text-muted-foreground">Select a load to view carrier responses</p>
                <Button 
                  onClick={() => setActiveTab("dashboard")}
                  variant="outline" 
                  className="mt-4"
                >
                  Return to Dashboard
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="matching">
            <LoadMatchingDashboard />
          </TabsContent>

          <TabsContent value="bidding">
            <BiddingInterface />
          </TabsContent>

          <TabsContent value="tracking">
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-gray-400" />
              <h2 className="mt-4 text-lg font-semibold">Shipment Tracking</h2>
              <p className="text-muted-foreground">Select a load from the dashboard to track its shipment</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Loads;
