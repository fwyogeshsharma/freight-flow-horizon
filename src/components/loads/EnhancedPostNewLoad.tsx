import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Package, Truck, Calendar, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MapPicker from "@/components/maps/MapPicker";
import DocumentUploader from "@/components/loads/DocumentUploader";

const EnhancedPostNewLoad = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    pickupCoords: { latitude: 0, longitude: 0 },
    dropoffLocation: "",
    dropoffCoords: { latitude: 0, longitude: 0 },
    loadType: "",
    weight: "",
    vehicleType: "",
    pickupDate: "",
    specialInstructions: "",
  });

  const [documents, setDocuments] = useState<any[]>([]);
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDropoffMap, setShowDropoffMap] = useState(false);

  const handleLocationSelect = (type: 'pickup' | 'dropoff', location: any) => {
    if (type === 'pickup') {
      setFormData(prev => ({
        ...prev,
        pickupLocation: location.address,
        pickupCoords: { latitude: location.latitude, longitude: location.longitude }
      }));
      setShowPickupMap(false);
    } else {
      setFormData(prev => ({
        ...prev,
        dropoffLocation: location.address,
        dropoffCoords: { latitude: location.latitude, longitude: location.longitude }
      }));
      setShowDropoffMap(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enhanced load posted:", { ...formData, documents });
    toast({
      title: "Load Posted Successfully",
      description: "Your load has been posted with geo-location and documents.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Post New Load (Enhanced)</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Enhanced Pickup & Drop-off Locations with Maps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Pickup & Drop-off Locations (Geo-tagged)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-600">Pickup Location</h3>
                <div>
                  <Label htmlFor="pickupLocation">Address</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="pickupLocation"
                      placeholder="Selected address will appear here"
                      value={formData.pickupLocation}
                      readOnly
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowPickupMap(!showPickupMap)}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {showPickupMap && (
                  <MapPicker
                    onLocationSelect={(location) => handleLocationSelect('pickup', location)}
                    placeholder="Search pickup location..."
                  />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-red-600">Drop-off Location</h3>
                <div>
                  <Label htmlFor="dropoffLocation">Address</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="dropoffLocation"
                      placeholder="Selected address will appear here"
                      value={formData.dropoffLocation}
                      readOnly
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowDropoffMap(!showDropoffMap)}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {showDropoffMap && (
                  <MapPicker
                    onLocationSelect={(location) => handleLocationSelect('dropoff', location)}
                    placeholder="Search drop-off location..."
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest of the form fields - simplified for brevity */}
        <Card>
          <CardHeader>
            <CardTitle>Load Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="loadType">Load Type</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, loadType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select load type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="steel">Steel</SelectItem>
                    <SelectItem value="chemicals">Chemicals</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Weight (tons)</Label>
                <Input
                  id="weight"
                  placeholder="Enter weight"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="trailer">Trailer</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Document Upload */}
        <DocumentUploader
          loadId="new-load"
          onDocumentsChange={setDocuments}
        />

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" className="gradient-bg">
            <Upload className="h-4 w-4 mr-2" />
            Post Load
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedPostNewLoad;
