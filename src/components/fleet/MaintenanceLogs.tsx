
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Wrench, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

const MaintenanceLogs = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [maintenanceRecords] = useState([
    {
      id: "M001",
      truck: "TN01AB1234",
      serviceType: "Oil Change",
      date: "2024-01-10",
      cost: "₹2,500",
      nextDue: "2024-04-10",
      status: "Completed",
      notes: "Full synthetic oil used. Filter replaced."
    },
    {
      id: "M002",
      truck: "KA02CD5678",
      serviceType: "Tire Replacement",
      date: "2024-01-05",
      cost: "₹18,000",
      nextDue: "2025-01-05",
      status: "Completed",
      notes: "All 6 tires replaced with new Bridgestone tires."
    },
    {
      id: "M003",
      truck: "MH03EF9012",
      serviceType: "Brake Service",
      date: "2024-01-15",
      cost: "₹5,500",
      nextDue: "2024-07-15",
      status: "Pending",
      notes: "Brake pads and fluid replacement required."
    }
  ]);

  const upcomingMaintenance = [
    {
      truck: "TN01AB1234",
      service: "Engine Checkup",
      dueDate: "2024-01-25",
      daysLeft: 7,
      priority: "Medium"
    },
    {
      truck: "KA02CD5678", 
      service: "PUC Renewal",
      dueDate: "2024-01-20",
      daysLeft: 2,
      priority: "High"
    }
  ];

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Maintenance Management</h2>
        <Button 
          className="gradient-bg"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Maintenance Record
        </Button>
      </div>

      {/* Upcoming Maintenance Alerts */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Upcoming Maintenance ({upcomingMaintenance.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingMaintenance.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                <div>
                  <p className="font-medium">{item.truck} - {item.service}</p>
                  <p className="text-sm text-muted-foreground">Due: {item.dueDate}</p>
                </div>
                <div className="text-right">
                  <Badge variant={item.priority === "High" ? "destructive" : "secondary"}>
                    {item.daysLeft} days left
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Maintenance Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMaintenance} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="truck">Select Truck</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose truck" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck1">TN01AB1234</SelectItem>
                      <SelectItem value="truck2">KA02CD5678</SelectItem>
                      <SelectItem value="truck3">MH03EF9012</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oil-change">Oil Change</SelectItem>
                      <SelectItem value="tire-replacement">Tire Replacement</SelectItem>
                      <SelectItem value="brake-service">Brake Service</SelectItem>
                      <SelectItem value="engine-checkup">Engine Checkup</SelectItem>
                      <SelectItem value="battery-replacement">Battery Replacement</SelectItem>
                      <SelectItem value="general-service">General Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceDate">Service Date</Label>
                  <Input id="serviceDate" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (₹)</Label>
                  <Input id="cost" type="number" placeholder="Enter cost" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextDue">Next Due Date</Label>
                  <Input id="nextDue" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Additional notes about the service" />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="gradient-bg">
                  Add Record
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

      {/* Maintenance History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Maintenance History</h3>
        {maintenanceRecords.map((record, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <Wrench className="h-5 w-5 mr-2" />
                    {record.truck} - {record.serviceType}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Record #{record.id}</p>
                </div>
                <Badge variant={record.status === "Completed" ? "default" : "secondary"}>
                  {record.status === "Completed" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Calendar className="h-3 w-3 mr-1" />
                  )}
                  {record.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Service Date</p>
                  <p className="font-medium">{record.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="font-medium">{record.cost}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Due</p>
                  <p className="font-medium">{record.nextDue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Until Due</p>
                  <p className="font-medium">
                    {Math.ceil((new Date(record.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>
              
              {record.notes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Notes:</strong> {record.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceLogs;
