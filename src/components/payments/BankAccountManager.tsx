
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, 
  Plus, 
  CheckCircle, 
  Clock,
  CreditCard,
  Shield
} from "lucide-react";

interface BankAccount {
  id: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name?: string;
  account_type?: string;
  is_verified: boolean;
  is_primary: boolean;
}

const BankAccountManager: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newAccount, setNewAccount] = useState({
    account_holder_name: '',
    account_number: '',
    ifsc_code: '',
    bank_name: '',
    branch_name: '',
    account_type: 'savings'
  });

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false });

      if (!error && data) {
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBankAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('bank_accounts')
        .insert({
          ...newAccount,
          user_id: user.id,
          is_primary: accounts.length === 0 // First account becomes primary
        });

      if (!error) {
        toast({
          title: "Bank Account Added",
          description: "Your bank account has been added successfully.",
        });
        
        setNewAccount({
          account_holder_name: '',
          account_number: '',
          ifsc_code: '',
          bank_name: '',
          branch_name: '',
          account_type: 'savings'
        });
        setShowAddDialog(false);
        fetchBankAccounts();
      }
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast({
        title: "Error",
        description: "Failed to add bank account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const setPrimaryAccount = async (accountId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Remove primary status from all accounts
      await supabase
        .from('bank_accounts')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      // Set new primary account
      const { error } = await supabase
        .from('bank_accounts')
        .update({ is_primary: true })
        .eq('id', accountId);

      if (!error) {
        toast({
          title: "Primary Account Updated",
          description: "Primary bank account has been updated successfully.",
        });
        fetchBankAccounts();
      }
    } catch (error) {
      console.error('Error setting primary account:', error);
    }
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
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
          <h1 className="text-3xl font-bold">Bank Accounts</h1>
          <p className="text-muted-foreground">Manage your bank accounts for withdrawals</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  value={newAccount.account_holder_name}
                  onChange={(e) => setNewAccount({...newAccount, account_holder_name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={newAccount.account_number}
                  onChange={(e) => setNewAccount({...newAccount, account_number: e.target.value})}
                  placeholder="1234567890"
                />
              </div>
              
              <div>
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  value={newAccount.ifsc_code}
                  onChange={(e) => setNewAccount({...newAccount, ifsc_code: e.target.value.toUpperCase()})}
                  placeholder="SBIN0001234"
                />
              </div>
              
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={newAccount.bank_name}
                  onChange={(e) => setNewAccount({...newAccount, bank_name: e.target.value})}
                  placeholder="State Bank of India"
                />
              </div>
              
              <div>
                <Label htmlFor="branchName">Branch Name (Optional)</Label>
                <Input
                  id="branchName"
                  value={newAccount.branch_name}
                  onChange={(e) => setNewAccount({...newAccount, branch_name: e.target.value})}
                  placeholder="Main Branch"
                />
              </div>
              
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Select value={newAccount.account_type} onValueChange={(value) => setNewAccount({...newAccount, account_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={addBankAccount} className="w-full">
                Add Bank Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle>{account.bank_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {account.account_holder_name}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {account.is_primary && (
                    <Badge variant="default">Primary</Badge>
                  )}
                  {account.is_verified ? (
                    <Badge variant="default" className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Account Number</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {maskAccountNumber(account.account_number)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">IFSC Code</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {account.ifsc_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Account Type</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {account.account_type}
                  </p>
                </div>
                {account.branch_name && (
                  <div>
                    <p className="text-sm font-medium">Branch</p>
                    <p className="text-sm text-muted-foreground">
                      {account.branch_name}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                {!account.is_primary && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPrimaryAccount(account.id)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Set as Primary
                  </Button>
                )}
                {!account.is_verified && (
                  <Button variant="outline" size="sm" disabled>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Account
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {accounts.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bank accounts added</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add a bank account to enable withdrawals
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BankAccountManager;
