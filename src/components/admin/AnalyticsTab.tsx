import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface AnalyticsData {
  totalRevenue: { name: string; revenue: number }[];
  totalOrders: { name: string; orders: number }[];
  newCustomers: { name: string; customers: number }[];
  salesByProduct: { name: string; sales: number }[];
}

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("created_at, total_amount, order_items(product_id, quantity, price)");

      if (ordersError) throw ordersError;

      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("created_at");

      if (usersError) throw usersError;

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name");

      if (productsError) throw productsError;

      const productMap = products.reduce((acc, p) => {
        acc[p.id] = p.name;
        return acc;
      }, {} as Record<string, string>);

      const now = new Date();
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        return {
          month: d.toLocaleString("default", { month: "short" }),
          year: d.getFullYear(),
        };
      }).reverse();

      const monthlyData = last6Months.map(({ month, year }) => ({
        name: month,
        revenue: 0,
        orders: 0,
        customers: 0,
      }));

      const salesByProduct: Record<string, number> = {};

      if (orders) {
        orders.forEach((order) => {
          const orderDate = new Date(order.created_at);
          const month = orderDate.toLocaleString("default", {
            month: "short",
          });
          const year = orderDate.getFullYear();

          const monthIndex = monthlyData.findIndex(
            (m) =>
              m.name === month &&
              last6Months.some((lm) => lm.month === month && lm.year === year)
          );

          if (monthIndex !== -1) {
            monthlyData[monthIndex].revenue += order.total_amount;
            monthlyData[monthIndex].orders += 1;
          }

          if (order.order_items) {
            (order.order_items as any[]).forEach((item) => {
              const productName = productMap[item.product_id] || "Unknown";
              salesByProduct[productName] = (salesByProduct[productName] || 0) + item.quantity * item.price;
            });
          }
        });
      }

      if (users) {
        users.forEach((user) => {
          const userDate = new Date(user.created_at);
          const month = userDate.toLocaleString("default", {
            month: "short",
          });
          const year = userDate.getFullYear();

          const monthIndex = monthlyData.findIndex(
            (m) =>
              m.name === month &&
              last6Months.some((lm) => lm.month === month && lm.year === year)
          );

          if (monthIndex !== -1) {
            monthlyData[monthIndex].customers += 1;
          }
        });
      }

      setAnalyticsData({
        totalRevenue: monthlyData.map((m) => ({
          name: m.name,
          revenue: m.revenue,
        })),
        totalOrders: monthlyData.map((m) => ({
          name: m.name,
          orders: m.orders,
        })),
        newCustomers: monthlyData.map((m) => ({
          name: m.name,
          customers: m.customers,
        })),
        salesByProduct: Object.entries(salesByProduct)
          .map(([name, sales]) => ({ name, sales }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 10),
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (!analyticsData) {
    return <div>Could not load analytics data.</div>;
  }

  const {
    totalRevenue: totalRevenueData,
    totalOrders: totalOrdersData,
    newCustomers: newCustomersData,
    salesByProduct: salesByProductData,
  } = analyticsData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={totalRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={totalOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={newCustomersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="customers" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sales by Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={salesByProductData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
