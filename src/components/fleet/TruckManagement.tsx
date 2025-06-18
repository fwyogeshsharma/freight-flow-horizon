
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Truck, FileText, Calendar, AlertTriangle } from "lucide-react";

const TruckManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [trucks, setTrucks] = useState([
    {
      id: "TN01AB1234",
      type: "Container",
      brand: "Tata",
      model: "407",
      capacity: { weight: "25 tons", volume: "40 cubic meters" },
      axle: "6x4",
      status: "Available",
      documents: {
        rc: { status: "Valid", expiry: "2025-03-15" },
        insurance: { status: "Valid", expiry: "2024-12-20" },
        permit: { status: "Expired", expiry: "2024-05-10" },
        puc: { status: "Valid", expiry: "2024-09-30" }
      }
    }
  ]);

  const vehicleTypes = [
    "Open Truck", "Container", "Tanker", "Refrigerated Truck", 
    "Flatbed", "Tipper", "Trailer", "Mini Truck", "Closed Body"
  ];

  const handleAddTruck = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle truck addition logic
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Truck Inventory</h2>
        <Button 
          className="gradient-bg"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Truck
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Truck</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTruck} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase().replace(' ', '-')}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plateNumber">License Plate Number</Label>
                  <Input id="plateNumber" placeholder="e.g., TN01AB1234" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" placeholder="e.g., Tata, Ashok Leyland" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="e.g., 407, 1616" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weightCapacity">Weight Capacity (tons)</Label>
                  <Input id="weightCapacity" type="number" placeholder="25" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volumeCapacity">Volume Capacity (cubic meters)</Label>
                  <Input id="volumeCapacity" type="number" placeholder="40" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="axleConfig">Axle Configuration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select axle configuration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4x2">4x2</SelectItem>
                      <SelectItem value="6x4">6x4</SelectItem>
                      <SelectItem value="8x4">8x4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chassisNumber">Chassis Number</Label>
                  <Input id="chassisNumber" placeholder="Optional" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialFeatures">Special Features</Label>
                <Textarea 
                  id="specialFeatures" 
                  placeholder="e.g., GPS enabled, refrigerated, crane attached"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="gradient-bg">
                  Add Truck
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Truck List */}
      <div className="space-y-4">
        {trucks.map((truck, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    {truck.id}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {truck.brand} {truck.model} - {truck.type}
                  </p>
                </div>
                <Badge variant={truck.status === "Available" ? "default" : "secondary"}>
                  {truck.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium">{truck.capacity.weight}</p>
                  <p className="text-xs text-muted-foreground">{truck.capacity.volume}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Axle Config</p>
                  <p className="font-medium">{truck.axle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documents</p>
                  <div className="flex space-x-1 mt-1">
                    {Object.entries(truck.documents).map(([doc, info]) => (
                      <Badge 
                        key={doc}
                        variant={info.status === "Valid" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {doc.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Service</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    15 days
                  </p>
                </div>
              </div>

              {/* Document Alerts */}
              {Object.entries(truck.documents).some(([, info]) => info.status === "Expired") && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center text-red-800">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Document Alert</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Some documents have expired. Update them to keep this vehicle active.
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-3 w-3 mr-1" />
                  Documents
                </Button>
                <Button variant="outline" size="sm">
                  Edit Details
                </Button>
                <Button variant="outline" size="sm">
                  Service History
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TruckManagement;
