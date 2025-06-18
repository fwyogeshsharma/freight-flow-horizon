
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  Shield,
  CheckCircle,
  Clock
} from "lucide-react";

interface PaymentGatewayProps {
  amount: number;
  invoiceId?: string;
  onSuccess?: (paymentId: string) => void;
  onFailure?: (error: string) => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  invoiceId,
  onSuccess,
  onFailure
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'PhonePe, GooglePay, Paytm'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building2,
      description: 'All major banks'
    },
    {
      id: 'wallet',
      name: 'Platform Wallet',
      icon: Wallet,
      description: 'Use your wallet balance'
    }
  ];

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would integrate with Razorpay/Stripe
      const paymentId = `pay_${Date.now()}`;
      
      toast({
        title: "Payment Successful",
        description: `Payment of ₹${amount.toFixed(2)} completed successfully.`,
      });
      
      onSuccess?.(paymentId);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or use a different payment method.",
        variant: "destructive",
      });
      
      onFailure?.("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Secure Payment</span>
        </CardTitle>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Amount to pay</span>
          <span className="text-2xl font-bold">₹{amount.toFixed(2)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Select Payment Method</Label>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <method.icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{method.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </button>
            ))}
          </div>
        </div>

        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry</Label>
                <Input id="expiry" placeholder="MM/YY" maxLength={5} />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" maxLength={3} />
              </div>
            </div>
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input id="cardholderName" placeholder="John Doe" />
            </div>
          </div>
        )}

        {selectedMethod === 'upi' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="username@paytm"
                type="email"
              />
            </div>
          </div>
        )}

        {selectedMethod === 'wallet' && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Wallet Balance</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Available: ₹2,500.00
            </p>
            <Badge variant="default" className="bg-green-100 text-green-700">
              Sufficient Balance
            </Badge>
          </div>
        )}

        <div className="space-y-4">
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Amount</span>
              <span>₹{amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Processing Fee</span>
              <span>₹{(amount * 0.02).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>₹{(amount * 1.02).toFixed(2)}</span>
            </div>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={processing}
            className="w-full"
          >
            {processing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Pay ₹{(amount * 1.02).toFixed(2)}
              </>
            )}
          </Button>

          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secured by 256-bit SSL encryption</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentGateway;
