
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Download, 
  Send, 
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";

interface Invoice {
  id: string;
  invoice_number: string;
  load_id: string;
  factory_owner_id: string;
  fleet_owner_id: string;
  pickup_location: string;
  drop_location: string;
  material_type: string;
  weight_tons: number;
  base_amount: number;
  platform_commission: number;
  agent_commission: number;
  tax_amount: number;
  total_amount: number;
  payment_status: string;
  invoice_date: string;
  created_at: string;
  loads?: {
    load_number: string;
  };
}

const InvoiceGenerator: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          loads (
            load_number
          )
        `)
        .or(`factory_owner_id.eq.${user.id},fleet_owner_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setInvoices(data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async (loadId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // This would typically be called when a load is completed
      // For now, showing the structure
      toast({
        title: "Invoice Generation",
        description: "Invoice generation will be automated when loads are completed.",
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-700">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage and track your invoices</p>
        </div>
        <Button onClick={() => generateInvoice('')} disabled>
          <FileText className="h-4 w-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      <div className="grid gap-6">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>{invoice.invoice_number}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Load: {invoice.loads?.load_number || invoice.load_id}
                  </p>
                </div>
                {getStatusBadge(invoice.payment_status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Route</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.pickup_location} → {invoice.drop_location}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Material</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.material_type} ({invoice.weight_tons} tons)
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.invoice_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-lg font-bold">₹{invoice.total_amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Base Amount:</span>
                    <span className="ml-2">₹{invoice.base_amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Platform Fee:</span>
                    <span className="ml-2">₹{invoice.platform_commission.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Agent Commission:</span>
                    <span className="ml-2">₹{invoice.agent_commission.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="ml-2">₹{invoice.tax_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                {invoice.payment_status === 'pending' && (
                  <Button size="sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {invoices.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No invoices found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Invoices will be automatically generated when loads are completed
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InvoiceGenerator;
