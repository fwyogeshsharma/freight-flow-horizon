
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Truck, 
  Factory, 
  Users, 
  Car, 
  Package 
} from "lucide-react";

interface RoleSelectorProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleSelect }) => {
  const roles = [
    {
      value: "super_admin",
      title: "Super Admin",
      description: "Platform-wide management and oversight",
      icon: Crown,
      color: "bg-purple-100 text-purple-700",
      features: ["User Management", "System Configuration", "Analytics", "KYC Approval"]
    },
    {
      value: "fleet_owner",
      title: "Fleet Owner",
      description: "Manage trucks, drivers, and deliveries",
      icon: Truck,
      color: "bg-blue-100 text-blue-700",
      features: ["Truck Management", "Driver Management", "Bid on Loads", "Trip Tracking"]
    },
    {
      value: "factory_owner",
      title: "Factory Owner",
      description: "Post loads and manage shipments",
      icon: Factory,
      color: "bg-green-100 text-green-700",
      features: ["Post Loads", "Manage Bids", "Track Shipments", "Payment Management"]
    },
    {
      value: "transport_agent",
      title: "Transport Agent",
      description: "Facilitate matches between loads and fleet",
      icon: Users,
      color: "bg-orange-100 text-orange-700",
      features: ["Load Matching", "Bid Management", "Commission Tracking", "Relationship Management"]
    },
    {
      value: "driver",
      title: "Driver",
      description: "Execute deliveries and manage trips",
      icon: Car,
      color: "bg-indigo-100 text-indigo-700",
      features: ["Trip Execution", "GPS Tracking", "Document Upload", "Emergency Alerts"]
    },
    {
      value: "consignee",
      title: "Consignee",
      description: "Receive shipments and provide confirmations",
      icon: Package,
      color: "bg-pink-100 text-pink-700",
      features: ["Delivery Confirmation", "ETA Updates", "Feedback & Rating", "Dispute Management"]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((role) => (
        <Card 
          key={role.value}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedRole === role.value ? 'ring-2 ring-primary border-primary' : ''
          }`}
          onClick={() => onRoleSelect(role.value)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${role.color}`}>
                <role.icon className="h-6 w-6" />
              </div>
              {selectedRole === role.value && (
                <Badge variant="default">Selected</Badge>
              )}
            </div>
            <CardTitle className="text-lg">{role.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {role.description}
            </p>
            <div className="space-y-1">
              {role.features.map((feature, index) => (
                <div key={index} className="text-xs text-muted-foreground flex items-center">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoleSelector;
