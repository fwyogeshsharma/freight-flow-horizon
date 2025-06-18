
-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
  'cancelled'
);

-- Create enum for transaction types
CREATE TYPE public.transaction_type AS ENUM (
  'credit',
  'debit',
  'commission',
  'refund',
  'withdrawal',
  'deposit'
);

-- Create enum for invoice status
CREATE TYPE public.invoice_status AS ENUM (
  'draft',
  'pending',
  'paid',
  'overdue',
  'cancelled'
);

-- Create wallets table
CREATE TABLE public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  frozen_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  is_frozen BOOLEAN NOT NULL DEFAULT FALSE,
  minimum_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT positive_balance CHECK (balance >= 0),
  CONSTRAINT positive_frozen_balance CHECK (frozen_balance >= 0)
);

-- Create wallet transactions table
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_before DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  description TEXT,
  reference_id TEXT, -- can reference load_id, invoice_id, etc.
  reference_type TEXT, -- 'load', 'invoice', 'withdrawal', etc.
  status payment_status NOT NULL DEFAULT 'pending',
  payment_gateway TEXT, -- 'razorpay', 'stripe', etc.
  gateway_transaction_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  load_id UUID REFERENCES public.loads(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID, -- will be added when trips are created
  factory_owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  fleet_owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  driver_id UUID REFERENCES public.drivers(id),
  truck_id UUID REFERENCES public.trucks(id),
  
  -- Invoice details
  pickup_location TEXT NOT NULL,
  drop_location TEXT NOT NULL,
  material_type TEXT NOT NULL,
  weight_tons DECIMAL NOT NULL,
  
  -- Financial details
  base_amount DECIMAL(15,2) NOT NULL,
  platform_commission DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  agent_commission DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(15,2) NOT NULL,
  
  -- Payment tracking
  payment_status invoice_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_gateway_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  due_date DATE,
  
  -- Invoice metadata
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  terms_conditions TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create commission rules table
CREATE TABLE public.commission_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  user_role user_role NOT NULL,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('percentage', 'fixed', 'slab')),
  value DECIMAL(10,4) NOT NULL, -- percentage or fixed amount
  min_amount DECIMAL(15,2), -- for slab-based rules
  max_amount DECIMAL(15,2), -- for slab-based rules
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  payer_id UUID REFERENCES public.profiles(id) NOT NULL,
  payee_id UUID REFERENCES public.profiles(id) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_gateway TEXT, -- 'razorpay', 'stripe', 'wallet'
  gateway_payment_id TEXT,
  gateway_response JSONB,
  status payment_status NOT NULL DEFAULT 'pending',
  failure_reason TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bank accounts table for withdrawals
CREATE TABLE public.bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  account_holder_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  branch_name TEXT,
  account_type TEXT CHECK (account_type IN ('savings', 'current')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, account_number)
);

-- Create withdrawal requests table
CREATE TABLE public.withdrawal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
  bank_account_id UUID REFERENCES public.bank_accounts(id) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  processed_by UUID REFERENCES public.profiles(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT positive_withdrawal_amount CHECK (amount > 0)
);

-- Create fuel advances table
CREATE TABLE public.fuel_advances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID, -- will reference trips table when created
  driver_id UUID REFERENCES public.drivers(id) NOT NULL,
  approved_by UUID REFERENCES public.profiles(id) NOT NULL, -- fleet owner or admin
  amount DECIMAL(15,2) NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'fuel',
  status payment_status NOT NULL DEFAULT 'pending',
  receipt_url TEXT, -- proof of fuel purchase
  notes TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT positive_advance_amount CHECK (amount > 0)
);

-- Enable RLS on all new tables
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_advances ENABLE ROW LEVEL SECURITY;

-- RLS policies for wallets
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super admins can view all wallets" ON public.wallets FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Users can update their own wallet settings" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert wallets" ON public.wallets FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update wallet balances" ON public.wallets FOR UPDATE USING (true);

-- RLS policies for wallet transactions
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super admins can view all transactions" ON public.wallet_transactions FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "System can insert transactions" ON public.wallet_transactions FOR INSERT WITH CHECK (true);

-- RLS policies for invoices
CREATE POLICY "Factory owners can view their invoices" ON public.invoices FOR SELECT USING (auth.uid() = factory_owner_id);
CREATE POLICY "Fleet owners can view their invoices" ON public.invoices FOR SELECT USING (auth.uid() = fleet_owner_id);
CREATE POLICY "Super admins can view all invoices" ON public.invoices FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "System can manage invoices" ON public.invoices FOR ALL USING (true);

-- RLS policies for commission rules
CREATE POLICY "Super admins can manage commission rules" ON public.commission_rules FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "All users can view active commission rules" ON public.commission_rules FOR SELECT USING (is_active = true);

-- RLS policies for payments
CREATE POLICY "Users can view their payments as payer" ON public.payments FOR SELECT USING (auth.uid() = payer_id);
CREATE POLICY "Users can view their payments as payee" ON public.payments FOR SELECT USING (auth.uid() = payee_id);
CREATE POLICY "Super admins can view all payments" ON public.payments FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "System can manage payments" ON public.payments FOR ALL USING (true);

-- RLS policies for bank accounts
CREATE POLICY "Users can manage their own bank accounts" ON public.bank_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Super admins can view all bank accounts" ON public.bank_accounts FOR SELECT USING (public.is_super_admin(auth.uid()));

-- RLS policies for withdrawal requests
CREATE POLICY "Users can manage their own withdrawal requests" ON public.withdrawal_requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Super admins can manage all withdrawal requests" ON public.withdrawal_requests FOR ALL USING (public.is_super_admin(auth.uid()));

-- RLS policies for fuel advances
CREATE POLICY "Drivers can view their fuel advances" ON public.fuel_advances FOR SELECT USING (EXISTS (SELECT 1 FROM public.drivers WHERE id = driver_id AND user_id = auth.uid()));
CREATE POLICY "Fleet owners can manage advances for their drivers" ON public.fuel_advances FOR ALL USING (auth.uid() = approved_by OR EXISTS (SELECT 1 FROM public.drivers WHERE id = driver_id AND fleet_owner_id = auth.uid()));
CREATE POLICY "Super admins can manage all fuel advances" ON public.fuel_advances FOR ALL USING (public.is_super_admin(auth.uid()));

-- Create function to automatically create wallet for new users
CREATE OR REPLACE FUNCTION public.create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id, balance, minimum_balance)
  VALUES (NEW.id, 0.00, 0.00);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create wallet
CREATE TRIGGER create_wallet_on_user_creation
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_wallet();

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  counter INTEGER;
  invoice_num TEXT;
BEGIN
  -- Get the next sequence number
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-(\d+)') AS INTEGER)), 0) + 1
  INTO counter
  FROM public.invoices
  WHERE invoice_number ~ '^INV-\d+$';
  
  -- Format: INV-000001
  invoice_num := 'INV-' || LPAD(counter::TEXT, 6, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Insert default commission rules
INSERT INTO public.commission_rules (rule_name, user_role, commission_type, value, is_active, created_by) VALUES
('Platform Commission - Fleet Owners', 'fleet_owner', 'percentage', 5.0, true, null),
('Platform Commission - Factory Owners', 'factory_owner', 'percentage', 2.0, true, null),
('Transport Agent Commission', 'transport_agent', 'fixed', 200.0, true, null);

-- Create indexes for better performance
CREATE INDEX idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_created_at ON public.wallet_transactions(created_at);
CREATE INDEX idx_invoices_factory_owner ON public.invoices(factory_owner_id);
CREATE INDEX idx_invoices_fleet_owner ON public.invoices(fleet_owner_id);
CREATE INDEX idx_invoices_payment_status ON public.invoices(payment_status);
CREATE INDEX idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX idx_payments_status ON public.payments(status);
