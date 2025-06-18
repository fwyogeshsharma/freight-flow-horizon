
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import DriverDashboard from "@/components/driver/DriverDashboard";
import TripManagement from "@/components/driver/TripManagement";
import DocumentUpload from "@/components/driver/DocumentUpload";
import EmergencyAlert from "@/components/driver/EmergencyAlert";
import DriverMessages from "@/components/driver/DriverMessages";
import VehicleInspection from "@/components/driver/VehicleInspection";
import FuelTracking from "@/components/driver/FuelTracking";
import { 
  LayoutDashboard, 
  MapPin, 
  FileText, 
  AlertTriangle, 
  MessageSquare, 
  Truck, 
  Fuel 
} from "lucide-react";

const DriverApp = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="trips" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Trips</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Emergency</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="inspection" className="flex items-center space-x-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Inspection</span>
            </TabsTrigger>
            <TabsTrigger value="fuel" className="flex items-center space-x-2">
              <Fuel className="h-4 w-4" />
              <span className="hidden sm:inline">Fuel</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DriverDashboard />
          </TabsContent>

          <TabsContent value="trips">
            <TripManagement />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentUpload />
          </TabsContent>

          <TabsContent value="emergency">
            <EmergencyAlert />
          </TabsContent>

          <TabsContent value="messages">
            <DriverMessages />
          </TabsContent>

          <TabsContent value="inspection">
            <VehicleInspection />
          </TabsContent>

          <TabsContent value="fuel">
            <FuelTracking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverApp;
