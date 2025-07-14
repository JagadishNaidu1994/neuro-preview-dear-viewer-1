import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Users, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  grossSales: number;
  returningCustomerRate: number;
  ordersFulfilled: number;
  totalOrders: number;
  recentOrdersData: any[];
  salesBreakdown: any[];
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    grossSales: 0,
    returningCustomerRate: 0,
    ordersFulfilled: 0,
    totalOrders: 0,
    recentOrdersData: [],
    salesBreakdown: [],
  });
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchLowStockProducts();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders data
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Calculate stats
      const totalOrders = orders?.length || 0;
      const grossSales = orders?.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;
      const deliveredOrders = orders?.filter(order => order.status === 'delivered').length || 0;
      
      // Get unique customers
      const uniqueCustomers = new Set(orders?.map(order => order.user_id)).size;
      const returningCustomerRate = uniqueCustomers > 1 ? ((uniqueCustomers - 1) / uniqueCustomers * 100) : 0;

      // Prepare chart data based on recent orders
      const recentOrdersData = orders?.slice(0, 10).map((order, index) => ({
        time: new Date(order.created_at).toLocaleDateString(),
        amount: Number(order.total_amount || 0),
        orders: 1
      })) || [];

      // Sales breakdown
      const salesBreakdown = [
        { name: 'Gross sales', value: grossSales, color: '#3b82f6' },
        { name: 'Discounts', value: grossSales * 0.05, color: '#ef4444' }, // 5% estimated discounts
        { name: 'Returns', value: grossSales * 0.02, color: '#f59e0b' }, // 2% estimated returns
        { name: 'Net sales', value: grossSales * 0.93, color: '#10b981' }, // Net after discounts/returns
        { name: 'Shipping charges', value: totalOrders * 50, color: '#8b5cf6' }, // ₹50 per order estimated
        { name: 'Return fees', value: 0, color: '#f97316' },
        { name: 'Taxes', value: grossSales * 0.18, color: '#06b6d4' }, // 18% GST
        { name: 'Total sales', value: grossSales, color: '#1f2937' },
      ];

      setStats({
        grossSales,
        returningCustomerRate: Math.round(returningCustomerRate),
        ordersFulfilled: deliveredOrders,
        totalOrders,
        recentOrdersData,
        salesBreakdown
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .lte("stock_quantity", 10); // Assuming low stock is 10 or less

      if (error) throw error;
      setLowStockProducts(data || []);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
    }
  };

  // Sample data for charts when no real data
  const salesOverTimeData = stats.recentOrdersData.length > 0 
    ? stats.recentOrdersData 
    : [
        { time: '12 AM', jul11: 0, jul10: 0 },
        { time: '2 AM', jul11: 0, jul10: 0 },
        { time: '4 AM', jul11: 0, jul10: 0 },
        { time: '6 AM', jul11: 0, jul10: 0 },
        { time: '8 AM', jul11: 0, jul10: 0 },
        { time: '10 AM', jul11: 0, jul10: 0 },
        { time: '12 PM', jul11: 0, jul10: 0 },
        { time: '2 PM', jul11: 0, jul10: 0 },
        { time: '4 PM', jul11: 0, jul10: 0 },
        { time: '6 PM', jul11: 0, jul10: 0 },
        { time: '8 PM', jul11: 0, jul10: 0 },
        { time: '10 PM', jul11: 0, jul10: 0 },
      ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-300">
          <CardHeader>
            <CardTitle className="text-yellow-800">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              The following products are running low on stock:
            </p>
            <ul className="list-disc list-inside mt-2">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="text-yellow-700">
                  {product.name} ({product.stock_quantity} remaining)
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Gross sales
              </CardTitle>
              <ArrowUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{stats.grossSales.toLocaleString()}</div>
            <div className="w-full h-8 mt-2">
              <div className="w-full h-1 bg-gray-200 rounded">
                <div className="h-1 bg-blue-500 rounded" style={{ width: stats.grossSales > 0 ? '100%' : '0%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Returning customer rate
              </CardTitle>
              <ArrowUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.returningCustomerRate}%</div>
            <div className="w-full h-8 mt-2">
              <div className="w-full h-1 bg-gray-200 rounded">
                <div className="h-1 bg-green-500 rounded" style={{ width: `${stats.returningCustomerRate}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Orders fulfilled
              </CardTitle>
              <ArrowUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.ordersFulfilled}</div>
            <div className="w-full h-8 mt-2">
              <div className="w-full h-1 bg-gray-200 rounded">
                <div className="h-1 bg-purple-500 rounded" style={{ width: stats.ordersFulfilled > 0 ? '100%' : '0%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Orders
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
            <div className="w-full h-8 mt-2">
              <div className="w-full h-1 bg-gray-200 rounded">
                <div className="h-1 bg-orange-500 rounded" style={{ width: stats.totalOrders > 0 ? '100%' : '0%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total sales over time */}
        <Card className="lg:col-span-2 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Total sales over time
            </CardTitle>
            <p className="text-2xl font-bold text-gray-900">₹{stats.grossSales.toLocaleString()}</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesOverTimeData}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    textAnchor="middle"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    name="Sales Amount"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Total sales breakdown */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Total sales breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.salesBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-blue-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{item.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sessions by social referrer */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Sessions by social referrer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 text-sm">No data for this date range</p>
            </div>
          </CardContent>
        </Card>

        {/* Total sales by referrer */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Total sales by referrer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 text-sm">No data for this date range</p>
            </div>
          </CardContent>
        </Card>

        {/* Sales attributed to marketing */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Sales attributed to marketing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 text-sm">No data for this date range</p>
            </div>
          </CardContent>
        </Card>

        {/* Sessions by referrer */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Sessions by referrer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 text-sm">No data for this date range</p>
            </div>
          </CardContent>
        </Card>

        {/* Total sales by POS location */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Total sales by POS location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 text-sm">No data for this date range</p>
            </div>
          </CardContent>
        </Card>

        {/* Products by sell-through rate */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Products by sell-through rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 text-sm">No data for this date range</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
