
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Package, Truck, Calendar, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PostNewLoad = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    pickupPincode: "",
    pickupCity: "",
    pickupState: "",
    dropoffLocation: "",
    dropoffPincode: "",
    dropoffCity: "",
    dropoffState: "",
    loadType: "",
    customLoadType: "",
    weight: "",
    weightUnit: "tons",
    volume: "",
    packages: "",
    packagingType: "",
    vehicleType: "",
    axleRequirement: "",
    refrigeration: false,
    pickupDate: "",
    pickupTime: "",
    deliveryDeadline: "",
    flexibility: "",
    specialInstructions: "",
  });

  const loadTypes = [
    "Steel", "Chemicals", "FMCG", "Electronics", "Food", 
    "Cement", "Textiles", "Automotive Parts", "Machinery", "Other"
  ];

  const vehicleTypes = [
    "Truck", "Trailer", "Container", "Tanker", "Mini Truck", 
    "Open Body", "Closed Body", "Refrigerated"
  ];

  const packagingTypes = [
    "Pallet", "Barrel", "Crate", "Loose", "Bags", "Boxes", "Rolls"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Load posted:", formData);
    toast({
      title: "Load Posted Successfully",
      description: "Your load has been posted and is now visible to carriers.",
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Post New Load</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pickup & Drop-off Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Pickup & Drop-off Locations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-600">Pickup Location</h3>
                <div>
                  <Label htmlFor="pickupLocation">Address</Label>
                  <Input
                    id="pickupLocation"
                    placeholder="Enter pickup address"
                    value={formData.pickupLocation}
                    onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="pickupPincode">Pin Code</Label>
                    <Input
                      id="pickupPincode"
                      placeholder="Pin code"
                      value={formData.pickupPincode}
                      onChange={(e) => handleInputChange("pickupPincode", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickupCity">City</Label>
                    <Input
                      id="pickupCity"
                      placeholder="City"
                      value={formData.pickupCity}
                      onChange={(e) => handleInputChange("pickupCity", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pickupState">State</Label>
                  <Input
                    id="pickupState"
                    placeholder="State"
                    value={formData.pickupState}
                    onChange={(e) => handleInputChange("pickupState", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-red-600">Drop-off Location</h3>
                <div>
                  <Label htmlFor="dropoffLocation">Address</Label>
                  <Input
                    id="dropoffLocation"
                    placeholder="Enter drop-off address"
                    value={formData.dropoffLocation}
                    onChange={(e) => handleInputChange("dropoffLocation", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="dropoffPincode">Pin Code</Label>
                    <Input
                      id="dropoffPincode"
                      placeholder="Pin code"
                      value={formData.dropoffPincode}
                      onChange={(e) => handleInputChange("dropoffPincode", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dropoffCity">City</Label>
                    <Input
                      id="dropoffCity"
                      placeholder="City"
                      value={formData.dropoffCity}
                      onChange={(e) => handleInputChange("dropoffCity", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dropoffState">State</Label>
                  <Input
                    id="dropoffState"
                    placeholder="State"
                    value={formData.dropoffState}
                    onChange={(e) => handleInputChange("dropoffState", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Load Type & Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Load Specifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loadType">Load Type</Label>
                <Select onValueChange={(value) => handleInputChange("loadType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select load type" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.loadType === "Other" && (
                <div>
                  <Label htmlFor="customLoadType">Custom Load Type</Label>
                  <Input
                    id="customLoadType"
                    placeholder="Specify custom load type"
                    value={formData.customLoadType}
                    onChange={(e) => handleInputChange("customLoadType", e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="weight">Weight</Label>
                <div className="flex space-x-2">
                  <Input
                    id="weight"
                    placeholder="Weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                  />
                  <Select onValueChange={(value) => handleInputChange("weightUnit", value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="kg">KG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="volume">Volume (m³)</Label>
                <Input
                  id="volume"
                  placeholder="Volume"
                  value={formData.volume}
                  onChange={(e) => handleInputChange("volume", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="packages">Number of Packages</Label>
                <Input
                  id="packages"
                  placeholder="Packages"
                  value={formData.packages}
                  onChange={(e) => handleInputChange("packages", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="packagingType">Packaging Type</Label>
              <Select onValueChange={(value) => handleInputChange("packagingType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select packaging type" />
                </SelectTrigger>
                <SelectContent>
                  {packagingTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Vehicle Requirements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleType">Preferred Vehicle Type</Label>
                <Select onValueChange={(value) => handleInputChange("vehicleType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="axleRequirement">Axle Requirement</Label>
                <Select onValueChange={(value) => handleInputChange("axleRequirement", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select axle requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-axle">2 Axle</SelectItem>
                    <SelectItem value="3-axle">3 Axle</SelectItem>
                    <SelectItem value="4-axle">4 Axle</SelectItem>
                    <SelectItem value="multi-axle">Multi Axle</SelectItem>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pickupDate">Pickup Date</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pickupTime">Pickup Time</Label>
                <Input
                  id="pickupTime"
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => handleInputChange("pickupTime", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="flexibility">Flexibility</Label>
                <Select onValueChange={(value) => handleInputChange("flexibility", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Time flexibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exact">Exact Time</SelectItem>
                    <SelectItem value="1hour">±1 Hour</SelectItem>
                    <SelectItem value="2hours">±2 Hours</SelectItem>
                    <SelectItem value="4hours">±4 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="deliveryDeadline">Delivery Deadline (Optional)</Label>
              <Input
                id="deliveryDeadline"
                type="datetime-local"
                value={formData.deliveryDeadline}
                onChange={(e) => handleInputChange("deliveryDeadline", e.target.value)}
              />
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
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

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

export default PostNewLoad;
