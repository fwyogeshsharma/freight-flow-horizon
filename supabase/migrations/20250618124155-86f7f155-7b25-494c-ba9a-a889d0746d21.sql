
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM (
  'super_admin',
  'fleet_owner', 
  'factory_owner',
  'transport_agent',
  'driver',
  'consignee'
);

-- Create enum for KYC status
CREATE TYPE public.kyc_status AS ENUM (
  'pending',
  'verified', 
  'rejected',
  'suspended'
);

-- Create enum for document types
CREATE TYPE public.document_type AS ENUM (
  'pan_card',
  'aadhaar_card',
  'driving_license',
  'vehicle_rc',
  'insurance_certificate',
  'permit',
  'gst_certificate',
  'company_registration',
  'bank_proof',
  'address_proof',
  'factory_verification',
  'police_verification'
);

-- Update profiles table to include role and KYC information
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'driver';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_status kyc_status DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gst_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pin_code TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rejected_reason TEXT;

-- Create KYC documents table
CREATE TABLE public.kyc_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL,
  document_number TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status kyc_status DEFAULT 'pending',
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, document_type)
);

-- Create organizations table (for fleet owners and factory owners)
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fleet', 'factory', 'transport_agency')),
  registration_number TEXT,
  gst_number TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  kyc_status kyc_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trucks table
CREATE TABLE public.trucks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fleet_owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES public.organizations(id),
  truck_number TEXT NOT NULL UNIQUE,
  truck_type TEXT NOT NULL,
  capacity_tons DECIMAL NOT NULL,
  model TEXT,
  year INTEGER,
  rc_number TEXT,
  insurance_expiry DATE,
  permit_expiry DATE,
  fitness_expiry DATE,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'maintenance', 'inactive')),
  current_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drivers table (separate from users for better organization)
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  fleet_owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  license_type TEXT NOT NULL,
  license_expiry DATE,
  experience_years INTEGER,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'on_trip', 'inactive')),
  rating DECIMAL DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loads table
CREATE TABLE public.loads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  factory_owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES public.organizations(id),
  load_number TEXT NOT NULL UNIQUE,
  pickup_location TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  drop_location TEXT NOT NULL,
  drop_address TEXT NOT NULL,
  material_type TEXT NOT NULL,
  weight_tons DECIMAL NOT NULL,
  truck_type_required TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  delivery_date DATE,
  price_quoted DECIMAL,
  bidding_enabled BOOLEAN DEFAULT TRUE,
  bidding_end_time TIMESTAMP WITH TIME ZONE,
  special_instructions TEXT,
  status TEXT DEFAULT 'posted' CHECK (status IN ('posted', 'bidding', 'assigned', 'in_progress', 'completed', 'cancelled')),
  assigned_to_fleet UUID REFERENCES public.profiles(id),
  assigned_truck_id UUID REFERENCES public.trucks(id),
  assigned_driver_id UUID REFERENCES public.drivers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bids table
CREATE TABLE public.bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  load_id UUID REFERENCES public.loads(id) ON DELETE CASCADE NOT NULL,
  fleet_owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  proposed_truck_id UUID REFERENCES public.trucks(id) NOT NULL,
  proposed_driver_id UUID REFERENCES public.drivers(id) NOT NULL,
  bid_amount DECIMAL NOT NULL,
  delivery_commitment DATE,
  comments TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(load_id, fleet_owner_id)
);

-- Create access_logs table for audit trail
CREATE TABLE public.access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
      AND kyc_status = 'verified'
  )
$$;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = 'super_admin'
  )
$$;

-- RLS policies for profiles (updated)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Super admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Super admins can update any profile" ON public.profiles FOR UPDATE USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for KYC documents
CREATE POLICY "Users can view their own KYC documents" ON public.kyc_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super admins can view all KYC documents" ON public.kyc_documents FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Users can upload their own KYC documents" ON public.kyc_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Super admins can update KYC status" ON public.kyc_documents FOR UPDATE USING (public.is_super_admin(auth.uid()));

-- RLS policies for organizations
CREATE POLICY "Users can view their own organizations" ON public.organizations FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Super admins can view all organizations" ON public.organizations FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Users can create their own organizations" ON public.organizations FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own organizations" ON public.organizations FOR UPDATE USING (auth.uid() = owner_id);

-- RLS policies for trucks
CREATE POLICY "Fleet owners can manage their trucks" ON public.trucks FOR ALL USING (auth.uid() = fleet_owner_id);
CREATE POLICY "Super admins can view all trucks" ON public.trucks FOR SELECT USING (public.is_super_admin(auth.uid()));

-- RLS policies for drivers
CREATE POLICY "Drivers can view their own profile" ON public.drivers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Fleet owners can manage their drivers" ON public.drivers FOR ALL USING (auth.uid() = fleet_owner_id);
CREATE POLICY "Super admins can view all drivers" ON public.drivers FOR SELECT USING (public.is_super_admin(auth.uid()));

-- RLS policies for loads
CREATE POLICY "Factory owners can manage their loads" ON public.loads FOR ALL USING (auth.uid() = factory_owner_id);
CREATE POLICY "Fleet owners can view available loads" ON public.loads FOR SELECT USING (public.has_role(auth.uid(), 'fleet_owner') AND status IN ('posted', 'bidding'));
CREATE POLICY "Transport agents can view loads" ON public.loads FOR SELECT USING (public.has_role(auth.uid(), 'transport_agent'));
CREATE POLICY "Super admins can view all loads" ON public.loads FOR SELECT USING (public.is_super_admin(auth.uid()));

-- RLS policies for bids
CREATE POLICY "Fleet owners can manage their bids" ON public.bids FOR ALL USING (auth.uid() = fleet_owner_id);
CREATE POLICY "Factory owners can view bids on their loads" ON public.bids FOR SELECT USING (EXISTS (SELECT 1 FROM public.loads WHERE id = load_id AND factory_owner_id = auth.uid()));
CREATE POLICY "Super admins can view all bids" ON public.bids FOR SELECT USING (public.is_super_admin(auth.uid()));

-- RLS policies for access logs
CREATE POLICY "Users can view their own access logs" ON public.access_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super admins can view all access logs" ON public.access_logs FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "All authenticated users can insert access logs" ON public.access_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public) VALUES ('kyc-documents', 'kyc-documents', false) ON CONFLICT DO NOTHING;

-- Storage policies for KYC documents
CREATE POLICY "Users can upload their KYC documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their KYC documents" ON storage.objects FOR SELECT USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Super admins can view all KYC documents" ON storage.objects FOR SELECT USING (bucket_id = 'kyc-documents' AND public.is_super_admin(auth.uid()));

-- Update handle_new_user function to include role setup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, role, kyc_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'driver'),
    'pending'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
