
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Users, ArrowRight, Plus } from "lucide-react";

const AssignmentManager = () => {
  const [assignments, setAssignments] = useState([
    {
      id: "A001",
      truck: { id: "TN01AB1234", type: "Container", capacity: "25 tons" },
      driver: { id: "D001", name: "Raj Kumar", phone: "+91 98765 43210" },
      status: "Active",
      currentTrip: "LD001 - Mumbai to Delhi",
      assignedDate: "2024-01-15"
    },
    {
      id: "A002",
      truck: { id: "KA02CD5678", type: "Medium Truck", capacity: "15 tons" },
      driver: { id: "D002", name: "Suresh Babu", phone: "+91 87654 32109" },
      status: "On Trip",
      currentTrip: "LD002 - Chennai to Bangalore",
      assignedDate: "2024-01-10"
    }
  ]);

  const [showAssignForm, setShowAssignForm] = useState(false);

  const handleNewAssignment = () => {
    setShowAssignForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Driver & Truck Assignments</h2>
        <Button 
          className="gradient-bg"
          onClick={handleNewAssignment}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Assignment
        </Button>
      </div>

      {showAssignForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Select Truck</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose available truck" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck1">TN01AB1234 - Container (25 tons)</SelectItem>
                    <SelectItem value="truck2">MH03EF9012 - Light Truck (5 tons)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Select Driver</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose available driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver1">Raj Kumar - 8 years exp</SelectItem>
                    <SelectItem value="driver2">Amit Singh - 5 years exp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <Button className="gradient-bg">
                Create Assignment
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowAssignForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map((assignment, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">Assignment #{assignment.id}</CardTitle>
                <Badge variant={assignment.status === "Active" ? "default" : "secondary"}>
                  {assignment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Truck Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 mr-2" />
                    Assigned Truck
                  </div>
                  <div>
                    <p className="font-medium">{assignment.truck.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {assignment.truck.type} - {assignment.truck.capacity}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>

                {/* Driver Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    Assigned Driver
                  </div>
                  <div>
                    <p className="font-medium">{assignment.driver.name}</p>
                    <p className="text-sm text-muted-foreground">{assignment.driver.phone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Trip</p>
                    <p className="font-medium">{assignment.currentTrip}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned Date</p>
                    <p className="font-medium">{assignment.assignedDate}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  Modify Assignment
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  Unassign
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssignmentManager;
