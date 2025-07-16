import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaDownload, FaTrophy, FaUser, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface CustomerCLV {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  total_spent: number;
  total_orders: number;
  avg_order_value: number;
  first_order_date: string | null;
  last_order_date: string | null;
  customer_lifetime_days: number | null;
}

const CLVAnalyticsTab = () => {
  const [customers, setCustomers] = useState<CustomerCLV[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    avgCLV: 0,
    topCustomerValue: 0,
    totalRevenue: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCLVData();
  }, []);

  const fetchCLVData = async () => {
    setLoading(true);
    try {
      // Fetch CLV data from the view we created
      const { data: clvData, error } = await supabase
        .from('customer_lifetime_value')
        .select('*')
        .order('total_spent', { ascending: false });

      if (error) throw error;

      const customerData = clvData || [];
      setCustomers(customerData);

      // Calculate statistics
      const totalCustomers = customerData.length;
      const totalRevenue = customerData.reduce((sum, customer) => sum + customer.total_spent, 0);
      const avgCLV = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
      const topCustomerValue = customerData.length > 0 ? customerData[0].total_spent : 0;

      setStats({
        totalCustomers,
        avgCLV,
        topCustomerValue,
        totalRevenue
      });

    } catch (error) {
      console.error('Error fetching CLV data:', error);
      toast({
        title: "Error",
        description: "Failed to load customer analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Rank',
      'Customer Email',
      'Customer Name',
      'Total Spent',
      'Total Orders',
      'Average Order Value',
      'First Order',
      'Last Order',
      'Customer Lifetime (Days)'
    ];

    const csvContent = [
      headers.join(','),
      ...customers.map((customer, index) => [
        index + 1,
        customer.email,
        `"${customer.first_name || ''} ${customer.last_name || ''}".trim()`,
        customer.total_spent,
        customer.total_orders,
        customer.avg_order_value.toFixed(2),
        customer.first_order_date ? new Date(customer.first_order_date).toLocaleDateString() : '',
        customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : '',
        customer.customer_lifetime_days || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer_clv_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "CLV data exported successfully",
    });
  };

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 10000) return { tier: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (totalSpent >= 5000) return { tier: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    if (totalSpent >= 2000) return { tier: 'Silver', color: 'bg-gray-100 text-gray-800' };
    return { tier: 'Bronze', color: 'bg-orange-100 text-orange-800' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Lifetime Value Analysis</h2>
        <Button onClick={exportToCSV} variant="outline">
          <FaDownload className="mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <FaUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FaDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CLV</CardTitle>
            <FaShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.avgCLV.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Customer Value</CardTitle>
            <FaTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.topCustomerValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Customer CLV Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Rankings by Lifetime Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                  <TableHead>First Order</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Lifetime (Days)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      Loading customer data...
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No customer data found
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer, index) => {
                    const tier = getCustomerTier(customer.total_spent);
                    return (
                      <TableRow key={customer.user_id}>
                        <TableCell>
                          <div className="flex items-center">
                            {index < 3 && <FaTrophy className={`mr-2 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`} />}
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.email}</p>
                            {(customer.first_name || customer.last_name) && (
                              <p className="text-sm text-muted-foreground">
                                {customer.first_name} {customer.last_name}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={tier.color}>
                            {tier.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{customer.total_spent.toFixed(2)}
                        </TableCell>
                        <TableCell>{customer.total_orders}</TableCell>
                        <TableCell>₹{customer.avg_order_value.toFixed(2)}</TableCell>
                        <TableCell>
                          {customer.first_order_date 
                            ? new Date(customer.first_order_date).toLocaleDateString()
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          {customer.last_order_date 
                            ? new Date(customer.last_order_date).toLocaleDateString()
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          {customer.customer_lifetime_days || 'N/A'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CLVAnalyticsTab;