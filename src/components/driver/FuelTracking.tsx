
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Fuel, Receipt, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FuelLog {
  id: string;
  fuel_amount: number;
  fuel_cost: number;
  odometer_reading: number | null;
  location: string | null;
  logged_at: string;
}

const FuelTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    truck_id: '',
    fuel_amount: '',
    fuel_cost: '',
    odometer_reading: '',
    location: ''
  });

  useEffect(() => {
    if (user) {
      fetchFuelLogs();
    }
  }, [user]);

  const fetchFuelLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('fuel_logs')
        .select('*')
        .eq('driver_id', user?.id)
        .order('logged_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setFuelLogs(data || []);
    } catch (error) {
      console.error('Error fetching fuel logs:', error);
      toast({
        title: "Error",
        description: "Failed to load fuel logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async (): Promise<string> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve('Location not available');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // You would use a reverse geocoding service here
            // For demo purposes, we'll just use coordinates
            const coords = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
            resolve(coords);
          } catch (error) {
            resolve('Location not available');
          }
        },
        () => resolve('Location not available'),
        { timeout: 5000 }
      );
    });
  };

  const addFuelLog = async () => {
    if (!user || !formData.truck_id || !formData.fuel_amount || !formData.fuel_cost) {
      toast({
        title: "Missing Information",
        description: "Please fill in truck ID, fuel amount, and cost",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      let location = formData.location;
      if (!location) {
        location = await getCurrentLocation();
      }

      const fuelData = {
        driver_id: user.id,
        truck_id: formData.truck_id,
        fuel_amount: parseFloat(formData.fuel_amount),
        fuel_cost: parseFloat(formData.fuel_cost),
        odometer_reading: formData.odometer_reading ? parseFloat(formData.odometer_reading) : null,
        location: location
      };

      const { error } = await supabase
        .from('fuel_logs')
        .insert(fuelData);

      if (error) throw error;

      toast({
        title: "Fuel Log Added",
        description: "Fuel information has been recorded successfully",
      });

      // Reset form and refresh logs
      setFormData({
        truck_id: '',
        fuel_amount: '',
        fuel_cost: '',
        odometer_reading: '',
        location: ''
      });
      
      fetchFuelLogs();
    } catch (error) {
      console.error('Error adding fuel log:', error);
      toast({
        title: "Error",
        description: "Failed to add fuel log",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Fuel Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Fuel className="h-5 w-5" />
            <span>Add Fuel Log</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="truck_id">Truck ID</Label>
                <Input
                  id="truck_id"
                  placeholder="Enter truck ID"
                  value={formData.truck_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, truck_id: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel_amount">Fuel Amount (Liters)</Label>
                <Input
                  id="fuel_amount"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.fuel_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, fuel_amount: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel_cost">Total Cost (₹)</Label>
                <Input
                  id="fuel_cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.fuel_cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, fuel_cost: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="odometer_reading">Odometer Reading (km)</Label>
                <Input
                  id="odometer_reading"
                  type="number"
                  placeholder="Optional"
                  value={formData.odometer_reading}
                  onChange={(e) => setFormData(prev => ({ ...prev, odometer_reading: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex space-x-2">
                <Input
                  id="location"
                  placeholder="Enter location or use GPS"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    const location = await getCurrentLocation();
                    setFormData(prev => ({ ...prev, location }));
                  }}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={addFuelLog}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Adding...' : 'Add Fuel Log'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Fuel Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Fuel Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : fuelLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Fuel className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No fuel logs recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fuelLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{log.fuel_amount}L</span>
                      <span className="text-muted-foreground">₹{log.fuel_cost}</span>
                      {log.odometer_reading && (
                        <span className="text-sm text-muted-foreground">
                          {log.odometer_reading} km
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {log.location && (
                        <>
                          <MapPin className="h-3 w-3" />
                          <span>{log.location}</span>
                        </>
                      )}
                      <span>{new Date(log.logged_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ₹{(log.fuel_cost / log.fuel_amount).toFixed(2)}/L
                    </p>
                    <p className="text-xs text-muted-foreground">Rate</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FuelTracking;
