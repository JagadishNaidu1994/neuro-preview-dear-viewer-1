
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";

const DashboardOverview = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "1,234",
      icon: ShoppingCart,
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Total Products",
      value: "567",
      icon: Package,
      change: "+3%",
      changeType: "positive"
    },
    {
      title: "Total Users",
      value: "890",
      icon: Users,
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Revenue",
      value: "$12,345",
      icon: TrendingUp,
      change: "+15%",
      changeType: "positive"
    }
  ];

  const recentOrders = [
    { id: "001", customer: "John Doe", amount: "$120.00", status: "Delivered" },
    { id: "002", customer: "Jane Smith", amount: "$85.50", status: "Shipped" },
    { id: "003", customer: "Bob Johnson", amount: "$200.00", status: "Processing" },
    { id: "004", customer: "Alice Brown", amount: "$150.75", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="font-medium text-gray-900">#{order.id}</div>
                  <div className="text-gray-600">{order.customer}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="font-medium text-gray-900">{order.amount}</div>
                  <Badge variant={
                    order.status === "Delivered" ? "default" :
                    order.status === "Shipped" ? "secondary" :
                    order.status === "Processing" ? "secondary" : "destructive"
                  }>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
