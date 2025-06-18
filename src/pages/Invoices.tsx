
import Navigation from "@/components/Navigation";
import InvoiceGenerator from "@/components/payments/InvoiceGenerator";

const Invoices = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <InvoiceGenerator />
      </div>
    </div>
  );
};

export default Invoices;
