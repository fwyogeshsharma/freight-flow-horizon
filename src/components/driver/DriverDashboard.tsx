
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Clock, Truck, AlertTriangle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Trip {
  id: string;
  load_id: string;
  truck_id: string;
  origin: string;
  destination: string;
  status: string;
  started_at: string | null;
  created_at: string;
}

const DriverDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('driver_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTrips(data || []);
      const active = data?.find(trip => trip.status === 'started' || trip.status === 'assigned');
      setActiveTrip(active || null);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast({
        title: "Error",
        description: "Failed to load trips",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-500';
      case 'started': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Driver Dashboard</h1>
      
      {/* Active Trip Card */}
      {activeTrip && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Trip</span>
              <Badge className={getStatusColor(activeTrip.status)}>
                {activeTrip.status.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{activeTrip.origin}</p>
                  <p className="text-xs text-muted-foreground">Origin</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{activeTrip.destination}</p>
                  <p className="text-xs text-muted-foreground">Destination</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{activeTrip.truck_id}</p>
                  <p className="text-xs text-muted-foreground">Vehicle</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-x-2">
              <Button size="sm">View Details</Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-3 w-3 mr-1" />
                Message Dispatcher
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Trip Management</h3>
            <p className="text-sm text-muted-foreground">Start, pause, or end trips</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <h3 className="font-semibold">Emergency Alert</h3>
            <p className="text-sm text-muted-foreground">Send panic button alert</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold">Messages</h3>
            <p className="text-sm text-muted-foreground">Chat with dispatchers</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Truck className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold">Vehicle Inspection</h3>
            <p className="text-sm text-muted-foreground">Log inspection reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trips */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trips.slice(0, 5).map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{trip.load_id}</p>
                  <p className="text-sm text-muted-foreground">
                    {trip.origin} → {trip.destination}
                  </p>
                </div>
                <Badge className={getStatusColor(trip.status)}>
                  {trip.status}
                </Badge>
              </div>
            ))}
            {trips.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No trips assigned yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboard;
