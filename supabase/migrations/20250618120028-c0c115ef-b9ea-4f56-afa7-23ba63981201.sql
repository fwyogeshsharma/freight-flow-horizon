
-- Create trips table for trip management
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  load_id TEXT NOT NULL,
  driver_id UUID REFERENCES auth.users(id) NOT NULL,
  truck_id TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'started', 'paused', 'completed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE,
  paused_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  distance_km DECIMAL,
  fuel_consumed DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trip_tracking table for GPS tracking
CREATE TABLE public.trip_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) NOT NULL,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  speed DECIMAL,
  heading DECIMAL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table for POD and inspection uploads
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id),
  truck_id TEXT,
  driver_id UUID REFERENCES auth.users(id) NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('pod', 'inspection', 'fuel_receipt', 'other')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emergency_alerts table
CREATE TABLE public.emergency_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES auth.users(id) NOT NULL,
  trip_id UUID REFERENCES public.trips(id),
  alert_type TEXT NOT NULL DEFAULT 'panic' CHECK (alert_type IN ('panic', 'breakdown', 'accident', 'medical')),
  latitude DECIMAL,
  longitude DECIMAL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create messages table for driver-dispatcher communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) NOT NULL,
  trip_id UUID REFERENCES public.trips(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fuel_logs table
CREATE TABLE public.fuel_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id TEXT NOT NULL,
  driver_id UUID REFERENCES auth.users(id) NOT NULL,
  trip_id UUID REFERENCES public.trips(id),
  fuel_amount DECIMAL NOT NULL,
  fuel_cost DECIMAL NOT NULL,
  odometer_reading DECIMAL,
  location TEXT,
  receipt_url TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicle_inspections table
CREATE TABLE public.vehicle_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id TEXT NOT NULL,
  driver_id UUID REFERENCES auth.users(id) NOT NULL,
  inspection_type TEXT NOT NULL CHECK (inspection_type IN ('pre_trip', 'post_trip', 'maintenance')),
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'needs_attention')),
  checklist_data JSONB NOT NULL,
  notes TEXT,
  images JSONB,
  inspected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_inspections ENABLE ROW LEVEL SECURITY;

-- RLS policies for trips
CREATE POLICY "Drivers can view their own trips" ON public.trips FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can update their own trips" ON public.trips FOR UPDATE USING (auth.uid() = driver_id);

-- RLS policies for trip_tracking
CREATE POLICY "Drivers can view their trip tracking" ON public.trip_tracking FOR SELECT USING (EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND driver_id = auth.uid()));
CREATE POLICY "Drivers can insert their trip tracking" ON public.trip_tracking FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND driver_id = auth.uid()));

-- RLS policies for documents
CREATE POLICY "Drivers can view their documents" ON public.documents FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can insert their documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = driver_id);

-- RLS policies for emergency_alerts
CREATE POLICY "Drivers can view their alerts" ON public.emergency_alerts FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can create alerts" ON public.emergency_alerts FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "Drivers can update their alerts" ON public.emergency_alerts FOR UPDATE USING (auth.uid() = driver_id);

-- RLS policies for messages
CREATE POLICY "Users can view their messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their received messages" ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);

-- RLS policies for fuel_logs
CREATE POLICY "Drivers can view their fuel logs" ON public.fuel_logs FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can create fuel logs" ON public.fuel_logs FOR INSERT WITH CHECK (auth.uid() = driver_id);

-- RLS policies for vehicle_inspections
CREATE POLICY "Drivers can view their inspections" ON public.vehicle_inspections FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can create inspections" ON public.vehicle_inspections FOR INSERT WITH CHECK (auth.uid() = driver_id);

-- Create storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('driver-documents', 'driver-documents', false);

-- Storage policies for driver documents
CREATE POLICY "Drivers can upload their documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'driver-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Drivers can view their documents" ON storage.objects FOR SELECT USING (bucket_id = 'driver-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
