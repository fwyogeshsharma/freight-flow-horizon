
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
import { useEnhancedLoads, type EnhancedLoad } from "@/hooks/useEnhancedLoads";

const EnhancedPostNewLoad = () => {
  const { toast } = useToast();
  const { createLoad, loading } = useEnhancedLoads();
  
  const [formData, setFormData] = useState<EnhancedLoad>({
    pickup_location: "",
    pickup_address: "",
    dropoff_location: "",
    dropoff_address: "",
    load_type: "",
    weight_value: 0,
    weight_unit: "tons",
    vehicle_type: "",
    pickup_date: "",
    special_instructions: "",
  });

  const [documents, setDocuments] = useState<any[]>([]);
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDropoffMap, setShowDropoffMap] = useState(false);

  const handleLocationSelect = (type: 'pickup' | 'dropoff', location: any) => {
    if (type === 'pickup') {
      setFormData(prev => ({
        ...prev,
        pickup_location: location.address,
        pickup_address: location.address,
        pickup_latitude: location.latitude,
        pickup_longitude: location.longitude,
        pickup_city: location.city,
        pickup_state: location.state,
        pickup_pincode: location.pincode,
      }));
      setShowPickupMap(false);
    } else {
      setFormData(prev => ({
        ...prev,
        dropoff_location: location.address,
        dropoff_address: location.address,
        dropoff_latitude: location.latitude,
        dropoff_longitude: location.longitude,
        dropoff_city: location.city,
        dropoff_state: location.state,
        dropoff_pincode: location.pincode,
      }));
      setShowDropoffMap(false);
    }
  };

  const handleInputChange = (field: keyof EnhancedLoad, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pickup_location || !formData.dropoff_location || !formData.load_type || !formData.vehicle_type || !formData.pickup_date || formData.weight_value <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await createLoad(formData);
      
      // Reset form
      setFormData({
        pickup_location: "",
        pickup_address: "",
        dropoff_location: "",
        dropoff_address: "",
        load_type: "",
        weight_value: 0,
        weight_unit: "tons",
        vehicle_type: "",
        pickup_date: "",
        special_instructions: "",
      });
      setDocuments([]);
    } catch (error) {
      console.error('Error submitting load:', error);
    }
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
                      value={formData.pickup_location}
                      readOnly
                      required
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
                      value={formData.dropoff_location}
                      readOnly
                      required
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

        {/* Load Details */}
        <Card>
          <CardHeader>
            <CardTitle>Load Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="loadType">Load Type *</Label>
                <Select onValueChange={(value) => handleInputChange("load_type", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select load type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="steel">Steel</SelectItem>
                    <SelectItem value="chemicals">Chemicals</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fmcg">FMCG</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="cement">Cement</SelectItem>
                    <SelectItem value="textiles">Textiles</SelectItem>
                    <SelectItem value="automotive">Automotive Parts</SelectItem>
                    <SelectItem value="machinery">Machinery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Weight (tons) *</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight"
                  value={formData.weight_value}
                  onChange={(e) => handleInputChange("weight_value", parseFloat(e.target.value) || 0)}
                  required
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="vehicleType">Vehicle Type *</Label>
                <Select onValueChange={(value) => handleInputChange("vehicle_type", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="trailer">Trailer</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                    <SelectItem value="tanker">Tanker</SelectItem>
                    <SelectItem value="mini_truck">Mini Truck</SelectItem>
                    <SelectItem value="open_body">Open Body</SelectItem>
                    <SelectItem value="closed_body">Closed Body</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="packages">Number of Packages</Label>
                <Input
                  id="packages"
                  type="number"
                  placeholder="Enter number of packages"
                  value={formData.number_of_packages || ""}
                  onChange={(e) => handleInputChange("number_of_packages", parseInt(e.target.value) || undefined)}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="volume">Volume (cubic meters)</Label>
                <Input
                  id="volume"
                  type="number"
                  placeholder="Enter volume"
                  value={formData.volume_value || ""}
                  onChange={(e) => handleInputChange("volume_value", parseFloat(e.target.value) || undefined)}
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="packagingType">Packaging Type</Label>
                <Select onValueChange={(value) => handleInputChange("packaging_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select packaging" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pallet">Pallet</SelectItem>
                    <SelectItem value="barrel">Barrel</SelectItem>
                    <SelectItem value="crate">Crate</SelectItem>
                    <SelectItem value="loose">Loose</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="rolls">Rolls</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Scheduling</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupDate">Pickup Date *</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  value={formData.pickup_date}
                  onChange={(e) => handleInputChange("pickup_date", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="deliveryDeadline">Delivery Deadline</Label>
                <Input
                  id="deliveryDeadline"
                  type="datetime-local"
                  value={formData.delivery_deadline || ""}
                  onChange={(e) => handleInputChange("delivery_deadline", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Special Instructions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="specialInstructions">Handling Instructions</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Enter any special handling instructions..."
                value={formData.special_instructions || ""}
                onChange={(e) => handleInputChange("special_instructions", e.target.value)}
                rows={4}
              />
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
          <Button type="submit" className="gradient-bg" disabled={loading}>
            <Upload className="h-4 w-4 mr-2" />
            {loading ? "Posting..." : "Post Load"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedPostNewLoad;
