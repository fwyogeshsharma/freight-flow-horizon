
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedPostNewLoad from "@/components/loads/EnhancedPostNewLoad";
import AdvancedLoadFilters from "@/components/loads/AdvancedLoadFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Package, Calendar, Plus } from "lucide-react";
import { useEnhancedLoads } from "@/hooks/useEnhancedLoads";

const EnhancedLoads = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filteredResults, setFilteredResults] = useState(15);
  const { loads, loading } = useEnhancedLoads();

  const handleFiltersChange = (filters: any) => {
    console.log("Filters applied:", filters);
    // Apply filtering logic here
    setFilteredResults(Math.floor(Math.random() * 20) + 5);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'posted': return 'outline';
      case 'bidding': return 'secondary';
      case 'assigned': return 'default';
      case 'in_progress': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enhanced Load Management</h1>
            <p className="text-muted-foreground">Advanced filtering, geo-tagging, and document management</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="post-load">Post New Load</TabsTrigger>
            <TabsTrigger value="search">Advanced Search</TabsTrigger>
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Posted Loads</h2>
              <Button 
                onClick={() => setActiveTab("post-load")}
                className="gradient-bg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post New Load
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p>Loading loads...</p>
              </div>
            ) : loads.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No loads posted yet</h3>
                  <p className="text-muted-foreground mb-4">Start by posting your first load</p>
                  <Button 
                    onClick={() => setActiveTab("post-load")}
                    className="gradient-bg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Load
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {loads.map((load) => (
                  <Card key={load.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{load.load_number}</CardTitle>
                          <p className="text-sm text-muted-foreground">{load.load_type}</p>
                        </div>
                        <Badge variant={getStatusVariant(load.status || 'posted')}>
                          {formatStatus(load.status || 'posted')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p className="font-medium">{load.weight_value} {load.weight_unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Route</p>
                          <p className="font-medium flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {load.pickup_city || 'Pickup'} → {load.dropoff_city || 'Drop-off'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Pickup Date</p>
                          <p className="font-medium flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(load.pickup_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Vehicle Type</p>
                          <p className="font-medium flex items-center">
                            <Truck className="h-3 w-3 mr-1" />
                            {load.vehicle_type}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Truck className="h-3 w-3 mr-1" />
                          View Bids
                        </Button>
                        {load.status === 'posted' && (
                          <Button size="sm" className="gradient-bg">
                            Assign Carrier
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="post-load">
            <EnhancedPostNewLoad />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <AdvancedLoadFilters
              onFiltersChange={handleFiltersChange}
              totalResults={filteredResults}
            />
          </TabsContent>

          <TabsContent value="tracking">
            <Card>
              <CardContent className="p-6 text-center">
                <p>Real-time tracking integration will be shown here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedLoads;
