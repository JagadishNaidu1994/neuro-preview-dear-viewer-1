
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Users, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const DashboardOverview = () => {
  // Sample data for charts
  const salesOverTimeData = [
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

  const averageOrderData = [
    { time: '12 AM', value: 0 },
    { time: '3 AM', value: 0 },
    { time: '6 AM', value: 0 },
    { time: '9 AM', value: 0 },
    { time: '12 PM', value: 0 },
    { time: '3 PM', value: 0 },
    { time: '6 PM', value: 0 },
    { time: '9 PM', value: 0 },
  ];

  const salesBreakdown = [
    { name: 'Gross sales', value: 0.00, color: '#3b82f6' },
    { name: 'Discounts', value: 0.00, color: '#ef4444' },
    { name: 'Returns', value: 0.00, color: '#f59e0b' },
    { name: 'Net sales', value: 0.00, color: '#10b981' },
    { name: 'Shipping charges', value: 0.00, color: '#8b5cf6' },
    { name: 'Return fees', value: 0.00, color: '#f97316' },
    { name: 'Taxes', value: 0.00, color: '#06b6d4' },
    { name: 'Total sales', value: 0.00, color: '#1f2937' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Gross sales
              </CardTitle>
              <ArrowUp className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹0</div>
            <div className="w-full h-8 mt-2">
              <div className="w-full h-1 bg-gray-200 rounded">
                <div className="h-1 bg-blue-500 rounded" style={{ width: '0%' }}></div>
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
              <ArrowDown className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0%</div>
            <div className="w-full h-8 mt-2">
              <div className="w-full h-1 bg-gray-200 rounded">
                <div className="h-1 bg-green-500 rounded" style={{ width: '0%' }}></div>
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
              <ArrowDown className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="w-full h-8 mt-2">
              <div className="w-full h-1 bg-gray-200 rounded">
                <div className="h-1 bg-purple-500 rounded" style={{ width: '0%' }}></div>
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
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="w-full h-8 mt-2">
              <div className="w-full h-1 bg-gray-200 rounded">
                <div className="h-1 bg-orange-500 rounded" style={{ width: '0%' }}></div>
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
            <p className="text-2xl font-bold text-gray-900">₹0</p>
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
                    dataKey="jul11" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    name="Jul 11, 2025"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="jul10" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Jul 10, 2025"
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
              {salesBreakdown.map((item, index) => (
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

      {/* Second Row - 6 Cards */}
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

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Average order value over time */}
        <Card className="lg:col-span-2 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Average order value over time
            </CardTitle>
            <p className="text-2xl font-bold text-gray-900">₹0</p>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={averageOrderData}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Total sales by product */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Total sales by product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500 text-sm">No data for this date range</p>
            </div>
          </CardContent>
        </Card>

        {/* POS staff sales total */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              POS staff sales total
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
