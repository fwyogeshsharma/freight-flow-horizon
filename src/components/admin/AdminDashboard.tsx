
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  FileCheck, 
  Building, 
  Truck, 
  BarChart3, 
  CheckCircle, 
  XCircle,
  Clock 
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingKYC: 0,
    verifiedUsers: 0,
    totalOrganizations: 0
  });
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
    fetchPendingDocuments();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    // Fetch user statistics
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('kyc_status');

    const { data: orgsData } = await supabase
      .from('organizations')
      .select('id');

    if (profilesData) {
      setStats({
        totalUsers: profilesData.length,
        pendingKYC: profilesData.filter(p => p.kyc_status === 'pending').length,
        verifiedUsers: profilesData.filter(p => p.kyc_status === 'verified').length,
        totalOrganizations: orgsData?.length || 0
      });
    }
  };

  const fetchPendingDocuments = async () => {
    const { data, error } = await supabase
      .from('kyc_documents')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          role
        )
      `)
      .eq('status', 'pending')
      .order('uploaded_at', { ascending: false });

    if (!error && data) {
      setPendingDocuments(data);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
  };

  const handleDocumentVerification = async (documentId: string, status: 'verified' | 'rejected', reason?: string) => {
    const { error } = await supabase
      .from('kyc_documents')
      .update({
        status,
        verified_by: supabase.auth.getUser()?.data.user?.id,
        verified_at: new Date().toISOString(),
        rejection_reason: reason
      })
      .eq('id', documentId);

    if (!error) {
      toast({
        title: `Document ${status}`,
        description: `KYC document has been ${status}.`,
      });
      fetchPendingDocuments();
      fetchStats();
    }
  };

  const handleUserStatusUpdate = async (userId: string, status: 'verified' | 'suspended' | 'rejected') => {
    const { error } = await supabase
      .from('profiles')
      .update({
        kyc_status: status,
        verified_at: status === 'verified' ? new Date().toISOString() : null
      })
      .eq('id', userId);

    if (!error) {
      toast({
        title: `User ${status}`,
        description: `User status has been updated to ${status}.`,
      });
      fetchUsers();
      fetchStats();
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Pending KYC",
      value: stats.pendingKYC,
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Verified Users",
      value: stats.verifiedUsers,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Organizations",
      value: stats.totalOrganizations,
      icon: Building,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform management and oversight</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="kyc" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="kyc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending KYC Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDocuments.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{doc.profiles?.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.document_type.replace('_', ' ').toUpperCase()} • 
                        Role: {doc.profiles?.role?.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleDocumentVerification(doc.id, 'verified')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDocumentVerification(doc.id, 'rejected', 'Document unclear or invalid')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingDocuments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No pending KYC documents
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{user.full_name || user.username}</p>
                      <div className="flex space-x-2">
                        <Badge variant="outline">
                          {user.role?.replace('_', ' ') || 'No Role'}
                        </Badge>
                        <Badge variant={
                          user.kyc_status === 'verified' ? 'default' :
                          user.kyc_status === 'pending' ? 'secondary' :
                          user.kyc_status === 'rejected' ? 'destructive' : 'outline'
                        }>
                          {user.kyc_status || 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {user.kyc_status !== 'verified' && (
                        <Button
                          size="sm"
                          onClick={() => handleUserStatusUpdate(user.id, 'verified')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Verify
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserStatusUpdate(user.id, 'suspended')}
                      >
                        Suspend
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Platform Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
