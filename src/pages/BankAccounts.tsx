
import Navigation from "@/components/Navigation";
import BankAccountManager from "@/components/payments/BankAccountManager";

const BankAccounts = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <BankAccountManager />
      </div>
    </div>
  );
};

export default BankAccounts;
