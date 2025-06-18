
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedTruck {
  id?: string;
  fleet_owner_id?: string;
  truck_number: string;
  vehicle_type: string;
  brand?: string;
  model?: string;
  year?: number;
  chassis_number?: string;
  weight_capacity_tons: number;
  volume_capacity_cubic_meters?: number;
  axle_configuration?: string;
  has_gps?: boolean;
  has_refrigeration?: boolean;
  has_crane?: boolean;
  special_features?: string;
  rc_number?: string;
  rc_expiry?: string;
  insurance_number?: string;
  insurance_expiry?: string;
  permit_number?: string;
  permit_expiry?: string;
  puc_expiry?: string;
  fitness_expiry?: string;
  status?: string;
  current_location?: string;
  current_latitude?: number;
  current_longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EnhancedDriver {
  id?: string;
  user_id?: string;
  fleet_owner_id?: string;
  license_number: string;
  license_type: string;
  license_expiry: string;
  experience_years?: number;
  total_trips?: number;
  rating?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  status?: string;
  current_location?: string;
  current_latitude?: number;
  current_longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export const useEnhancedFleet = () => {
  const [trucks, setTrucks] = useState<EnhancedTruck[]>([]);
  const [drivers, setDrivers] = useState<EnhancedDriver[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTrucks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enhanced_trucks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrucks(data || []);
    } catch (error) {
      console.error('Error fetching trucks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch trucks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enhanced_drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch drivers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTruck = async (truckData: EnhancedTruck) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('enhanced_trucks')
        .insert([{
          ...truckData,
          fleet_owner_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Truck added successfully",
      });

      await fetchTrucks();
      return data;
    } catch (error) {
      console.error('Error creating truck:', error);
      toast({
        title: "Error",
        description: "Failed to add truck",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createDriver = async (driverData: EnhancedDriver) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('enhanced_drivers')
        .insert([{
          ...driverData,
          fleet_owner_id: user.id,
          user_id: user.id, // For now, using same user. In real app, this would be the driver's user ID
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Driver added successfully",
      });

      await fetchDrivers();
      return data;
    } catch (error) {
      console.error('Error creating driver:', error);
      toast({
        title: "Error",
        description: "Failed to add driver",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTrucks();
    fetchDrivers();
  }, []);

  return {
    trucks,
    drivers,
    loading,
    createTruck,
    createDriver,
    fetchTrucks,
    fetchDrivers,
  };
};
