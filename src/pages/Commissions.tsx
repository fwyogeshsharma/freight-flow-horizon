
import Navigation from "@/components/Navigation";
import CommissionDashboard from "@/components/payments/CommissionDashboard";

const Commissions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <CommissionDashboard />
      </div>
    </div>
  );
};

export default Commissions;
