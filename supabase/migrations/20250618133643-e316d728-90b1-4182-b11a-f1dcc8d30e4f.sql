
-- Create enhanced loads table with geo-tagging support
CREATE TABLE IF NOT EXISTS public.enhanced_loads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  factory_owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  load_number TEXT NOT NULL UNIQUE DEFAULT ('LD-' || LPAD(EXTRACT(epoch FROM NOW())::TEXT, 10, '0')),
  
  -- Pickup location with geo-tagging
  pickup_location TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  pickup_city TEXT,
  pickup_state TEXT,
  pickup_pincode TEXT,
  
  -- Drop-off location with geo-tagging
  dropoff_location TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  dropoff_latitude DECIMAL(10, 8),
  dropoff_longitude DECIMAL(11, 8),
  dropoff_city TEXT,
  dropoff_state TEXT,
  dropoff_pincode TEXT,
  
  -- Load specifications
  load_type TEXT NOT NULL,
  custom_load_type TEXT,
  weight_value DECIMAL NOT NULL,
  weight_unit TEXT DEFAULT 'tons',
  volume_value DECIMAL,
  volume_unit TEXT DEFAULT 'cubic_meters',
  number_of_packages INTEGER,
  packaging_type TEXT,
  
  -- Vehicle requirements
  vehicle_type TEXT NOT NULL,
  axle_requirement TEXT,
  refrigeration_needed BOOLEAN DEFAULT FALSE,
  tanker_insulation_needed BOOLEAN DEFAULT FALSE,
  
  -- Scheduling
  pickup_date DATE NOT NULL,
  pickup_time_start TIME,
  pickup_time_end TIME,
  delivery_deadline TIMESTAMP WITH TIME ZONE,
  time_flexibility_hours INTEGER DEFAULT 0,
  
  -- Special instructions
  special_instructions TEXT,
  handling_sop_url TEXT,
  
  -- Status and assignment
  status TEXT DEFAULT 'posted' CHECK (status IN ('posted', 'bidding', 'assigned', 'in_progress', 'completed', 'cancelled')),
  assigned_fleet_id UUID REFERENCES public.profiles(id),
  assigned_truck_id UUID,
  assigned_driver_id UUID,
  
  -- Pricing
  quoted_price DECIMAL,
  final_price DECIMAL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enhanced trucks table
CREATE TABLE IF NOT EXISTS public.enhanced_trucks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fleet_owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic information
  truck_number TEXT NOT NULL UNIQUE,
  vehicle_type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  chassis_number TEXT,
  
  -- Capacity specifications
  weight_capacity_tons DECIMAL NOT NULL,
  volume_capacity_cubic_meters DECIMAL,
  axle_configuration TEXT,
  
  -- Special features
  has_gps BOOLEAN DEFAULT FALSE,
  has_refrigeration BOOLEAN DEFAULT FALSE,
  has_crane BOOLEAN DEFAULT FALSE,
  special_features TEXT,
  
  -- Documents and compliance
  rc_number TEXT,
  rc_expiry DATE,
  insurance_number TEXT,
  insurance_expiry DATE,
  permit_number TEXT,
  permit_expiry DATE,
  puc_expiry DATE,
  fitness_expiry DATE,
  
  -- Status and location
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'in_transit', 'maintenance', 'inactive')),
  current_location TEXT,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enhanced drivers table
CREATE TABLE IF NOT EXISTS public.enhanced_drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  fleet_owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- License information
  license_number TEXT NOT NULL UNIQUE,
  license_type TEXT NOT NULL,
  license_expiry DATE NOT NULL,
  
  -- Experience and ratings
  experience_years INTEGER DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  
  -- Emergency contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Status and availability
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'on_trip', 'off_duty', 'inactive')),
  current_location TEXT,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create load documents table
CREATE TABLE IF NOT EXISTS public.load_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  load_id UUID REFERENCES public.enhanced_loads(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.profiles(id) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create load bids table
CREATE TABLE IF NOT EXISTS public.load_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  load_id UUID REFERENCES public.enhanced_loads(id) ON DELETE CASCADE NOT NULL,
  fleet_owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Bid details
  bid_amount DECIMAL NOT NULL,
  proposed_truck_id UUID REFERENCES public.enhanced_trucks(id) NOT NULL,
  proposed_driver_id UUID REFERENCES public.enhanced_drivers(id) NOT NULL,
  estimated_pickup_time TIMESTAMP WITH TIME ZONE,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  
  -- Additional information
  comments TEXT,
  special_conditions TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(load_id, fleet_owner_id)
);

-- Enable RLS on all tables
ALTER TABLE public.enhanced_loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.load_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.load_bids ENABLE ROW LEVEL SECURITY;

-- RLS policies for enhanced_loads
CREATE POLICY "Factory owners can manage their loads" ON public.enhanced_loads 
FOR ALL USING (auth.uid() = factory_owner_id);

CREATE POLICY "Fleet owners can view available loads" ON public.enhanced_loads 
FOR SELECT USING (status IN ('posted', 'bidding') AND auth.uid() IS NOT NULL);

CREATE POLICY "Assigned fleet can view their loads" ON public.enhanced_loads 
FOR SELECT USING (auth.uid() = assigned_fleet_id);

-- RLS policies for enhanced_trucks
CREATE POLICY "Fleet owners can manage their trucks" ON public.enhanced_trucks 
FOR ALL USING (auth.uid() = fleet_owner_id);

-- RLS policies for enhanced_drivers
CREATE POLICY "Drivers can view their profile" ON public.enhanced_drivers 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Fleet owners can manage their drivers" ON public.enhanced_drivers 
FOR ALL USING (auth.uid() = fleet_owner_id);

-- RLS policies for load_documents
CREATE POLICY "Load participants can manage documents" ON public.load_documents 
FOR ALL USING (
  auth.uid() = uploaded_by OR 
  EXISTS (SELECT 1 FROM public.enhanced_loads WHERE id = load_id AND (factory_owner_id = auth.uid() OR assigned_fleet_id = auth.uid()))
);

-- RLS policies for load_bids
CREATE POLICY "Fleet owners can manage their bids" ON public.load_bids 
FOR ALL USING (auth.uid() = fleet_owner_id);

CREATE POLICY "Factory owners can view bids on their loads" ON public.load_bids 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.enhanced_loads WHERE id = load_id AND factory_owner_id = auth.uid())
);

-- Create indexes for better performance
CREATE INDEX idx_enhanced_loads_factory_owner ON public.enhanced_loads(factory_owner_id);
CREATE INDEX idx_enhanced_loads_status ON public.enhanced_loads(status);
CREATE INDEX idx_enhanced_loads_pickup_date ON public.enhanced_loads(pickup_date);
CREATE INDEX idx_enhanced_trucks_fleet_owner ON public.enhanced_trucks(fleet_owner_id);
CREATE INDEX idx_enhanced_trucks_status ON public.enhanced_trucks(status);
CREATE INDEX idx_enhanced_drivers_fleet_owner ON public.enhanced_drivers(fleet_owner_id);
CREATE INDEX idx_enhanced_drivers_user_id ON public.enhanced_drivers(user_id);
CREATE INDEX idx_load_bids_load_id ON public.load_bids(load_id);
CREATE INDEX idx_load_bids_fleet_owner ON public.load_bids(fleet_owner_id);

-- Create storage bucket for load documents
INSERT INTO storage.buckets (id, name, public) VALUES ('load-documents', 'load-documents', true) ON CONFLICT DO NOTHING;

-- Storage policies for load documents
CREATE POLICY "Authenticated users can upload load documents" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'load-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Load participants can view documents" ON storage.objects 
FOR SELECT USING (bucket_id = 'load-documents' AND auth.uid() IS NOT NULL);
