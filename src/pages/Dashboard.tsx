import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  FileText, 
  MapPin, 
  Users, 
  ArrowUp, 
  ArrowDown, 
  DollarSign,
  Package,
  Clock,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const stats = [
    {
      title: "Active Loads",
      value: "24",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Fleet Vehicles",
      value: "156",
      change: "+3%",
      icon: Truck,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Drivers",
      value: "89",
      change: "+8%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Monthly Revenue",
      value: "₹2.4M",
      change: "+15%",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "In Transit",
      value: "47",
      change: "-2%",
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Delivered Today",
      value: "32",
      change: "+18%",
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Avg Delivery Time",
      value: "4.2h",
      change: "-8%",
      icon: Clock,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    },
    {
      title: "Alerts",
      value: "3",
      change: "-25%",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const recentLoads = [
    {
      id: "LD001",
      from: "Mumbai",
      to: "Delhi",
      status: "In Transit",
      driver: "Raj Kumar",
      eta: "2 hours",
      progress: 75
    },
    {
      id: "LD002", 
      from: "Chennai",
      to: "Bangalore",
      status: "Loading",
      driver: "Suresh Babu",
      eta: "4 hours",
      progress: 10
    },
    {
      id: "LD003",
      from: "Pune",
      to: "Hyderabad", 
      status: "Delivered",
      driver: "Amit Singh",
      eta: "Completed",
      progress: 100
    },
    {
      id: "LD004",
      from: "Kolkata",
      to: "Guwahati",
      status: "In Transit",
      driver: "Ravi Sharma",
      eta: "6 hours",
      progress: 45
    }
  ];

  // Chart data
  const weeklyDeliveries = [
    { day: "Mon", deliveries: 45, revenue: 180000 },
    { day: "Tue", deliveries: 52, revenue: 210000 },
    { day: "Wed", deliveries: 38, revenue: 165000 },
    { day: "Thu", deliveries: 61, revenue: 240000 },
    { day: "Fri", deliveries: 55, revenue: 220000 },
    { day: "Sat", deliveries: 42, revenue: 170000 },
    { day: "Sun", deliveries: 28, revenue: 115000 }
  ];

  const monthlyTrend = [
    { month: "Jan", loads: 280, delivered: 265, delayed: 15 },
    { month: "Feb", loads: 320, delivered: 305, delayed: 15 },
    { month: "Mar", loads: 350, delivered: 335, delayed: 15 },
    { month: "Apr", loads: 410, delivered: 390, delayed: 20 },
    { month: "May", loads: 380, delivered: 370, delayed: 10 },
    { month: "Jun", loads: 450, delivered: 435, delayed: 15 }
  ];

  const fleetStatus = [
    { name: "Active", value: 89, color: "#10B981" },
    { name: "Maintenance", value: 12, color: "#F59E0B" },
    { name: "Idle", value: 35, color: "#6B7280" },
    { name: "Out of Service", value: 20, color: "#EF4444" }
  ];

  const routePerformance = [
    { route: "Mumbai-Delhi", loads: 45, onTime: 92 },
    { route: "Chennai-Bangalore", loads: 38, onTime: 95 },
    { route: "Pune-Hyderabad", loads: 32, onTime: 88 },
    { route: "Kolkata-Guwahati", loads: 28, onTime: 85 },
    { route: "Ahmedabad-Jaipur", loads: 25, onTime: 90 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your logistics operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {stat.change.startsWith('+') ? (
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Weekly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyDeliveries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'deliveries' ? `${value} deliveries` : `₹${(value / 1000).toFixed(0)}K`,
                      name === 'deliveries' ? 'Deliveries' : 'Revenue'
                    ]}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="deliveries" 
                    stackId="1" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6}
                    name="deliveries"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fleet Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-green-600" />
                Fleet Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={fleetStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fleetStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} vehicles`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends & Route Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Monthly Delivery Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="loads" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Total Loads"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="delivered" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Delivered"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="delayed" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Delayed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Route Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                Top Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routePerformance.map((route, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{route.route}</div>
                      <div className="text-xs text-muted-foreground">{route.loads} loads</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        route.onTime >= 90 ? 'text-green-600' : 
                        route.onTime >= 85 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {route.onTime}%
                      </div>
                      <div className="text-xs text-muted-foreground">on-time</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Loads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-indigo-600" />
              Recent Loads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLoads.map((load, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="font-semibold text-gray-900">{load.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {load.from} → {load.to}
                    </div>
                    <Badge variant={
                      load.status === "Delivered" ? "default" :
                      load.status === "In Transit" ? "secondary" : "outline"
                    }>
                      {load.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{load.driver}</div>
                      <div className="text-xs text-muted-foreground">ETA: {load.eta}</div>
                    </div>
                    <div className="w-20">
                      <div className="text-xs text-muted-foreground mb-1">{load.progress}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            load.progress === 100 ? 'bg-green-500' : 
                            load.progress > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${load.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex space-x-2">
              <Button variant="outline" className="flex-1">
                View All Loads
              </Button>
              <Button className="flex-1">
                Create New Load
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;