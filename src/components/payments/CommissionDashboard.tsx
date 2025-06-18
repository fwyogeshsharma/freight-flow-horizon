
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Calculator,
  Settings,
  BarChart3
} from "lucide-react";

interface CommissionRule {
  id: string;
  rule_name: string;
  user_role: string;
  commission_type: string;
  value: number;
  min_amount?: number;
  max_amount?: number;
  is_active: boolean;
}

interface CommissionEarning {
  period: string;
  amount: number;
  transactions: number;
}

const CommissionDashboard: React.FC = () => {
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [earnings, setEarnings] = useState<CommissionEarning[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCommissionRules();
    fetchEarnings();
  }, []);

  const fetchCommissionRules = async () => {
    try {
      const { data, error } = await supabase
        .from('commission_rules')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRules(data);
      }
    } catch (error) {
      console.error('Error fetching commission rules:', error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // This would fetch actual commission earnings from transactions
      // For now, showing sample data
      const sampleEarnings = [
        { period: 'This Month', amount: 15240, transactions: 42 },
        { period: 'Last Month', amount: 18350, transactions: 38 },
        { period: 'Last 3 Months', amount: 47890, transactions: 125 }
      ];
      
      setEarnings(sampleEarnings);
      setTotalEarnings(15240);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCommissionTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="h-4 w-4" />;
      case 'fixed':
        return <DollarSign className="h-4 w-4" />;
      case 'slab':
        return <Calculator className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const formatCommissionValue = (rule: CommissionRule) => {
    if (rule.commission_type === 'percentage') {
      return `${rule.value}%`;
    } else if (rule.commission_type === 'fixed') {
      return `₹${rule.value}`;
    } else {
      return `₹${rule.value} (${rule.min_amount}-${rule.max_amount})`;
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
      <div>
        <h1 className="text-3xl font-bold">Commission Dashboard</h1>
        <p className="text-muted-foreground">Track your earnings and commission structure</p>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Earning commissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹362.86</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earnings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="earnings">Earnings History</TabsTrigger>
          <TabsTrigger value="rules">Commission Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earnings.map((earning, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{earning.period}</p>
                      <p className="text-sm text-muted-foreground">
                        {earning.transactions} transactions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ₹{earning.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹{(earning.amount / earning.transactions).toFixed(2)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Commission Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getCommissionTypeIcon(rule.commission_type)}
                      <div>
                        <p className="font-medium">{rule.rule_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {rule.user_role.replace('_', ' ')} • {rule.commission_type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatCommissionValue(rule)}
                      </p>
                      <Badge variant="default" className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Commission Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Detailed analytics dashboard coming soon...
                <br />
                <Button className="mt-4" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommissionDashboard;
