
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Users, Star, Phone, Calendar, FileText } from "lucide-react";

const DriverManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [drivers] = useState([
    {
      id: "D001",
      name: "Raj Kumar",
      phone: "+91 98765 43210",
      experience: "8 years",
      rating: 4.7,
      totalTrips: 245,
      license: {
        number: "TN0120230045678",
        class: "HMV",
        expiry: "2026-08-15",
        status: "Valid"
      },
      assignedTruck: "TN01AB1234",
      status: "Available",
      languages: ["Tamil", "Hindi", "English"],
      photo: "/api/placeholder/60/60"
    },
    {
      id: "D002", 
      name: "Suresh Babu",
      phone: "+91 87654 32109",
      experience: "12 years",
      rating: 4.9,
      totalTrips: 389,
      license: {
        number: "KA0520180067890",
        class: "HMV",
        expiry: "2025-02-20",
        status: "Valid"
      },
      assignedTruck: "KA02CD5678",
      status: "On Trip",
      languages: ["Kannada", "Hindi", "Telugu"],
      photo: "/api/placeholder/60/60"
    }
  ]);

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Driver Management</h2>
        <Button 
          className="gradient-bg"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Driver
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Driver</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddDriver} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverName">Full Name</Label>
                  <Input id="driverName" placeholder="Enter driver's full name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Mobile Number</Label>
                  <Input id="phoneNumber" placeholder="+91 XXXXX XXXXX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input id="emergencyContact" placeholder="Emergency contact number" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Input id="bloodGroup" placeholder="e.g., O+, A-, B+" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Driving License Number</Label>
                  <Input id="licenseNumber" placeholder="License number" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseClass">License Class</Label>
                  <Input id="licenseClass" placeholder="e.g., LMV, HMV" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">License Expiry</Label>
                  <Input id="licenseExpiry" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input id="experience" type="number" placeholder="Years of driving experience" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">Known Languages</Label>
                  <Input id="languages" placeholder="e.g., Hindi, English, Tamil" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Complete address" />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="gradient-bg">
                  Add Driver
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

      {/* Driver List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drivers.map((driver, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={driver.photo} />
                    <AvatarFallback>
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{driver.name}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {driver.phone}
                    </p>
                  </div>
                </div>
                <Badge variant={driver.status === "Available" ? "default" : "secondary"}>
                  {driver.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <span className="text-sm font-medium">{driver.experience}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{driver.rating}</span>
                    <span className="text-xs text-muted-foreground">({driver.totalTrips} trips)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">License</span>
                  <div className="text-right">
                    <p className="text-sm font-medium">{driver.license.class}</p>
                    <Badge 
                      variant={driver.license.status === "Valid" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {driver.license.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Assigned Truck</span>
                  <span className="text-sm font-medium">{driver.assignedTruck}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Languages</span>
                  <span className="text-sm font-medium">{driver.languages.join(", ")}</span>
                </div>

                {/* License Expiry Warning */}
                {new Date(driver.license.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    <div className="flex items-center text-yellow-800">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="text-xs">License expires on {driver.license.expiry}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  <FileText className="h-3 w-3 mr-1" />
                  Documents
                </Button>
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  Trip History
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DriverManagement;
