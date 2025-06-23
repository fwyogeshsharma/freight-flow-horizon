import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Calendar, 
  Search, 
  Filter,
  Truck,
  Package,
  Receipt,
  CreditCard,
  FileBarChart,
  DollarSign,
  PieChart,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Building,
  Calculator
} from "lucide-react";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const reportCategories = [
    {
      id: "trip-parcel",
      title: "Trip & Parcel Reports",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      count: 3,
      reports: [
        {
          name: "All Trips Report",
          description: "Comprehensive overview of all completed and ongoing trips",
          icon: Truck,
          lastGenerated: "2 hours ago",
          frequency: "Daily"
        },
        {
          name: "Document Report",
          description: "Document tracking and compliance reports",
          icon: FileText,
          lastGenerated: "1 day ago",
          frequency: "Weekly"
        },
        {
          name: "Route-wise Average Pricing Report",
          description: "Pricing analysis and trends by route",
          icon: TrendingUp,
          lastGenerated: "3 hours ago",
          frequency: "Monthly"
        }
      ]
    },
    {
      id: "eway-bill",
      title: "E-Way Bill Reports",
      icon: Receipt,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      count: 1,
      reports: [
        {
          name: "E-Way Bill Report",
          description: "Complete e-way bill generation and tracking report",
          icon: Receipt,
          lastGenerated: "4 hours ago",
          frequency: "Daily"
        }
      ]
    },
    {
      id: "pod",
      title: "POD Reports",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      count: 5,
      reports: [
        {
          name: "Upload Register",
          description: "Track all POD uploads and their status",
          icon: Upload,
          lastGenerated: "1 hour ago",
          frequency: "Real-time"
        },
        {
          name: "Payment Tracking",
          description: "Monitor payment status against PODs",
          icon: CreditCard,
          lastGenerated: "2 hours ago",
          frequency: "Daily"
        },
        {
          name: "Advance Due",
          description: "Outstanding advance payments report",
          icon: Clock,
          lastGenerated: "6 hours ago",
          frequency: "Weekly"
        },
        {
          name: "Balance Due",
          description: "Pending balance payments tracking",
          icon: AlertTriangle,
          lastGenerated: "5 hours ago",
          frequency: "Daily"
        },
        {
          name: "Complete Payment",
          description: "Fully settled payment transactions",
          icon: CheckCircle,
          lastGenerated: "3 hours ago",
          frequency: "Monthly"
        }
      ]
    },
    {
      id: "tds",
      title: "TDS Reports",
      icon: Calculator,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      count: 3,
      reports: [
        {
          name: "TDS by Consignor",
          description: "TDS deductions categorized by consignor",
          icon: Users,
          lastGenerated: "1 day ago",
          frequency: "Monthly"
        },
        {
          name: "TDS Register",
          description: "Complete TDS deduction register",
          icon: FileBarChart,
          lastGenerated: "12 hours ago",
          frequency: "Monthly"
        },
        {
          name: "TDS of Vehicle Provider",
          description: "TDS applicable to vehicle service providers",
          icon: Truck,
          lastGenerated: "8 hours ago",
          frequency: "Monthly"
        }
      ]
    },
    {
      id: "payment",
      title: "Payment Reports",
      icon: CreditCard,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      count: 2,
      reports: [
        {
          name: "Detailed Payment Report",
          description: "Comprehensive payment transaction details",
          icon: DollarSign,
          lastGenerated: "30 minutes ago",
          frequency: "Daily"
        },
        {
          name: "Payment Delay Report",
          description: "Analysis of delayed payments and trends",
          icon: Clock,
          lastGenerated: "2 hours ago",
          frequency: "Weekly"
        }
      ]
    },
    {
      id: "invoice",
      title: "Invoice Reports",
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      count: 7,
      reports: [
        {
          name: "All Invoice Register",
          description: "Complete invoice database and tracking",
          icon: FileText,
          lastGenerated: "1 hour ago",
          frequency: "Daily"
        },
        {
          name: "Master Invoice Register",
          description: "Master invoice compilation report",
          icon: FileBarChart,
          lastGenerated: "3 hours ago",
          frequency: "Monthly"
        },
        {
          name: "Pending Invoices",
          description: "Outstanding invoice tracking",
          icon: Clock,
          lastGenerated: "45 minutes ago",
          frequency: "Daily"
        },
        {
          name: "Late Payment Invoices",
          description: "Invoices with overdue payments",
          icon: AlertTriangle,
          lastGenerated: "2 hours ago",
          frequency: "Weekly"
        },
        {
          name: "Early Payment Invoices",
          description: "Invoices paid before due date",
          icon: CheckCircle,
          lastGenerated: "4 hours ago",
          frequency: "Monthly"
        },
        {
          name: "Client Due",
          description: "Client-wise outstanding amounts",
          icon: Users,
          lastGenerated: "1 hour ago",
          frequency: "Daily"
        },
        {
          name: "Client Overdue Invoices",
          description: "Overdue invoices by client",
          icon: AlertTriangle,
          lastGenerated: "3 hours ago",
          frequency: "Weekly"
        }
      ]
    },
    {
      id: "financial",
      title: "Financial Reports",
      icon: PieChart,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      count: 3,
      reports: [
        {
          name: "Ledger Register",
          description: "Complete financial ledger and transactions",
          icon: FileBarChart,
          lastGenerated: "6 hours ago",
          frequency: "Monthly"
        },
        {
          name: "Income Statement",
          description: "Profit and loss statement",
          icon: TrendingUp,
          lastGenerated: "1 day ago",
          frequency: "Monthly"
        },
        {
          name: "Balance Sheet",
          description: "Assets, liabilities and equity statement",
          icon: PieChart,
          lastGenerated: "1 day ago",
          frequency: "Quarterly"
        }
      ]
    },
    {
      id: "admin",
      title: "Admin Reports",
      icon: Building,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      count: 6,
      reports: [
        {
          name: "Agent-wise Contribution",
          description: "Performance analysis by agent",
          icon: Users,
          lastGenerated: "4 hours ago",
          frequency: "Monthly"
        },
        {
          name: "Client-wise Billing/Sales",
          description: "Client revenue and billing analysis",
          icon: DollarSign,
          lastGenerated: "2 hours ago",
          frequency: "Monthly"
        },
        {
          name: "Location-wise Client Billing Comparison",
          description: "Geographic billing performance comparison",
          icon: MapPin,
          lastGenerated: "5 hours ago",
          frequency: "Quarterly"
        },
        {
          name: "Vehicle Provider Billing/Sales",
          description: "Vehicle provider revenue analysis",
          icon: Truck,
          lastGenerated: "3 hours ago",
          frequency: "Monthly"
        },
        {
          name: "Location-wise Vehicle Provider Billing Comparison",
          description: "Geographic vehicle provider performance",
          icon: MapPin,
          lastGenerated: "6 hours ago",
          frequency: "Quarterly"
        },
        {
          name: "Client-wise Margin Comparison",
          description: "Profit margin analysis by client",
          icon: TrendingUp,
          lastGenerated: "4 hours ago",
          frequency: "Monthly"
        }
      ]
    }
  ];

  const categories = [
    { id: "all", name: "All Categories", count: reportCategories.reduce((acc, cat) => acc + cat.count, 0) },
    ...reportCategories.map(cat => ({ id: cat.id, name: cat.title, count: cat.count }))
  ];

  const filteredCategories = selectedCategory === "all" 
    ? reportCategories 
    : reportCategories.filter(cat => cat.id === selectedCategory);

  const getFrequencyBadge = (frequency: string) => {
    const colorMap = {
      "Real-time": "bg-green-100 text-green-800",
      "Daily": "bg-blue-100 text-blue-800", 
      "Weekly": "bg-yellow-100 text-yellow-800",
      "Monthly": "bg-purple-100 text-purple-800",
      "Quarterly": "bg-orange-100 text-orange-800"
    };
    return colorMap[frequency as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-muted-foreground">Generate and manage all business reports</p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Report Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <Card key={category.id} className={`${category.borderColor} border-l-4`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${category.bgColor}`}>
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} reports available</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.reports.map((report, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <report.icon className="h-5 w-5 text-gray-600" />
                            <h4 className="font-semibold text-sm">{report.name}</h4>
                          </div>
                          <Badge className={getFrequencyBadge(report.frequency)}>
                            {report.frequency}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                          {report.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <span>Last generated: {report.lastGenerated}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Generate
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="flex items-center gap-2 h-16">
                <Download className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Bulk Download</div>
                  <div className="text-xs opacity-80">Download multiple reports</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center gap-2 h-16">
                <Calendar className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Schedule Reports</div>
                  <div className="text-xs opacity-80">Automate report generation</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center gap-2 h-16">
                <FileBarChart className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Custom Report</div>
                  <div className="text-xs opacity-80">Create custom analytics</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Upload icon component (since it's not in lucide-react by default)
const Upload = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

export default Reports;