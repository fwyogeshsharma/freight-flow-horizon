
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedLoad {
  id?: string;
  factory_owner_id?: string;
  load_number?: string;
  pickup_location: string;
  pickup_address: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  pickup_city?: string;
  pickup_state?: string;
  pickup_pincode?: string;
  dropoff_location: string;
  dropoff_address: string;
  dropoff_latitude?: number;
  dropoff_longitude?: number;
  dropoff_city?: string;
  dropoff_state?: string;
  dropoff_pincode?: string;
  load_type: string;
  custom_load_type?: string;
  weight_value: number;
  weight_unit: string;
  volume_value?: number;
  volume_unit?: string;
  number_of_packages?: number;
  packaging_type?: string;
  vehicle_type: string;
  axle_requirement?: string;
  refrigeration_needed?: boolean;
  tanker_insulation_needed?: boolean;
  pickup_date: string;
  pickup_time_start?: string;
  pickup_time_end?: string;
  delivery_deadline?: string;
  time_flexibility_hours?: number;
  special_instructions?: string;
  handling_sop_url?: string;
  status?: string;
  quoted_price?: number;
  final_price?: number;
  created_at?: string;
  updated_at?: string;
}

export const useEnhancedLoads = () => {
  const [loads, setLoads] = useState<EnhancedLoad[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLoads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enhanced_loads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoads(data || []);
    } catch (error) {
      console.error('Error fetching loads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch loads",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createLoad = async (loadData: EnhancedLoad) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('enhanced_loads')
        .insert([{
          ...loadData,
          factory_owner_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Load posted successfully",
      });

      await fetchLoads();
      return data;
    } catch (error) {
      console.error('Error creating load:', error);
      toast({
        title: "Error",
        description: "Failed to post load",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateLoad = async (id: string, updates: Partial<EnhancedLoad>) => {
    try {
      const { error } = await supabase
        .from('enhanced_loads')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Load updated successfully",
      });

      await fetchLoads();
    } catch (error) {
      console.error('Error updating load:', error);
      toast({
        title: "Error",
        description: "Failed to update load",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  return {
    loads,
    loading,
    createLoad,
    updateLoad,
    fetchLoads,
  };
};
