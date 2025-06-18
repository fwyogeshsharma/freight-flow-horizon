
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, Square, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Trip {
  id: string;
  load_id: string;
  truck_id: string;
  origin: string;
  destination: string;
  status: string;
  started_at: string | null;
  paused_at: string | null;
  completed_at: string | null;
}

const TripManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [trackingInterval, setTrackingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      fetchActiveTrip();
    }
  }, [user]);

  useEffect(() => {
    if (activeTrip?.status === 'started') {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
    
    return () => stopLocationTracking();
  }, [activeTrip?.status]);

  const fetchActiveTrip = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('driver_id', user?.id)
        .in('status', ['assigned', 'started', 'paused'])
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setActiveTrip(data);
    } catch (error) {
      console.error('Error fetching active trip:', error);
    }
  };

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(coords);
          resolve(coords);
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const startLocationTracking = () => {
    const interval = setInterval(async () => {
      try {
        const coords = await getCurrentLocation();
        if (activeTrip) {
          await supabase.from('trip_tracking').insert({
            trip_id: activeTrip.id,
            latitude: coords.lat,
            longitude: coords.lng,
            speed: 0, // You can get speed from navigator.geolocation if available
            heading: 0
          });
        }
      } catch (error) {
        console.error('Error tracking location:', error);
      }
    }, 30000); // Track every 30 seconds

    setTrackingInterval(interval);
  };

  const stopLocationTracking = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }
  };

  const startTrip = async () => {
    if (!activeTrip) return;

    try {
      await getCurrentLocation();
      
      const { error } = await supabase
        .from('trips')
        .update({ 
          status: 'started', 
          started_at: new Date().toISOString() 
        })
        .eq('id', activeTrip.id);

      if (error) throw error;

      setActiveTrip({ ...activeTrip, status: 'started', started_at: new Date().toISOString() });
      
      toast({
        title: "Trip Started",
        description: "GPS tracking is now active",
      });
    } catch (error) {
      console.error('Error starting trip:', error);
      toast({
        title: "Error",
        description: "Failed to start trip. Please check location permissions.",
        variant: "destructive",
      });
    }
  };

  const pauseTrip = async () => {
    if (!activeTrip) return;

    try {
      const { error } = await supabase
        .from('trips')
        .update({ 
          status: 'paused', 
          paused_at: new Date().toISOString() 
        })
        .eq('id', activeTrip.id);

      if (error) throw error;

      setActiveTrip({ ...activeTrip, status: 'paused', paused_at: new Date().toISOString() });
      
      toast({
        title: "Trip Paused",
        description: "GPS tracking has been paused",
      });
    } catch (error) {
      console.error('Error pausing trip:', error);
      toast({
        title: "Error",
        description: "Failed to pause trip",
        variant: "destructive",
      });
    }
  };

  const endTrip = async () => {
    if (!activeTrip) return;

    try {
      const { error } = await supabase
        .from('trips')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        })
        .eq('id', activeTrip.id);

      if (error) throw error;

      setActiveTrip(null);
      
      toast({
        title: "Trip Completed",
        description: "Trip has been marked as completed",
      });
    } catch (error) {
      console.error('Error ending trip:', error);
      toast({
        title: "Error",
        description: "Failed to complete trip",
        variant: "destructive",
      });
    }
  };

  if (!activeTrip) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No Active Trip</h3>
          <p className="text-muted-foreground">You don't have any active trips assigned.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Trip Management</span>
            <Badge variant={activeTrip.status === 'started' ? 'default' : 'secondary'}>
              {activeTrip.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {activeTrip.started_at 
                    ? `Started: ${new Date(activeTrip.started_at).toLocaleString()}`
                    : 'Not started yet'
                  }
                </p>
                <p className="text-xs text-muted-foreground">Trip Status</p>
              </div>
            </div>

            {location && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-800">GPS Location Active</p>
                <p className="text-xs text-green-600">
                  Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              {activeTrip.status === 'assigned' && (
                <Button onClick={startTrip} className="flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Start Trip</span>
                </Button>
              )}
              
              {activeTrip.status === 'started' && (
                <>
                  <Button 
                    onClick={pauseTrip} 
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pause Trip</span>
                  </Button>
                  <Button 
                    onClick={endTrip}
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <Square className="h-4 w-4" />
                    <span>End Trip</span>
                  </Button>
                </>
              )}
              
              {activeTrip.status === 'paused' && (
                <>
                  <Button onClick={startTrip} className="flex items-center space-x-2">
                    <Play className="h-4 w-4" />
                    <span>Resume Trip</span>
                  </Button>
                  <Button 
                    onClick={endTrip}
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <Square className="h-4 w-4" />
                    <span>End Trip</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripManagement;
