
import Navigation from "@/components/Navigation";
import PaymentGateway from "@/components/payments/PaymentGateway";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentGatewayPage = () => {
  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
  };

  const handlePaymentFailure = (error: string) => {
    console.log('Payment failed:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentGateway
                amount={1500}
                invoiceId="INV-000001"
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayPage;
