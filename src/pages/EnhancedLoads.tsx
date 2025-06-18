
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedPostNewLoad from "@/components/loads/EnhancedPostNewLoad";
import AdvancedLoadFilters from "@/components/loads/AdvancedLoadFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EnhancedLoads = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filteredResults, setFilteredResults] = useState(15);

  const handleFiltersChange = (filters: any) => {
    console.log("Filters applied:", filters);
    // Apply filtering logic here
    setFilteredResults(Math.floor(Math.random() * 20) + 5);
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
            <Card>
              <CardHeader>
                <CardTitle>Load Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Enhanced dashboard with better visualization coming soon...</p>
              </CardContent>
            </Card>
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
