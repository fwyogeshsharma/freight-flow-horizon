
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Shield, Settings, FileText, Wallet, CreditCard, DollarSign, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your account and organization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Organization Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" defaultValue="Faberwork Logistics" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Fleet Owner" disabled />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Business Park, Mumbai, Maharashtra" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+91 98765 43210" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="admin@faberwork.com" />
                  </div>
                </div>
                <Button className="gradient-bg">Update Profile</Button>
              </CardContent>
            </Card>

            {/* Document Verification */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Document Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "GST Certificate", status: "Verified" },
                    { name: "PAN Card", status: "Verified" },
                    { name: "Transport License", status: "Pending" },
                    { name: "Insurance Certificate", status: "Verified" }
                  ].map((doc, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">{doc.name}</span>
                      <Badge variant={doc.status === "Verified" ? "default" : "outline"}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Features */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment & Financial Services
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Link to="/wallet">
                  <Button variant="outline" className="w-full justify-start">
                    <Wallet className="h-4 w-4 mr-2" />
                    Wallet
                  </Button>
                </Link>
                <Link to="/invoices">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Invoices
                  </Button>
                </Link>
                <Link to="/commissions">
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Commissions
                  </Button>
                </Link>
                <Link to="/bank-accounts">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    Bank Accounts
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">KYC Status</span>
                    <Badge>Completed</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Account Type</span>
                    <Badge variant="outline">Fleet Owner</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Member Since</span>
                    <span className="text-sm text-muted-foreground">Jan 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  API Keys
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
