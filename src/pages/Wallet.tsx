
import Navigation from "@/components/Navigation";
import WalletDashboard from "@/components/payments/WalletDashboard";

const Wallet = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <WalletDashboard />
      </div>
    </div>
  );
};

export default Wallet;
