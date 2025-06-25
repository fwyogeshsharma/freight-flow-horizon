
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  Search, 
  Calendar,
  RefreshCw,
  FileText,
  SlidersHorizontal
} from "lucide-react";

const ReportDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reportData, reportName, reportDescription } = location.state || {};
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);

  // Sample data - in real app, this would come from the API
  const [reportFields, setReportFields] = useState([
    { id: 1, tripId: "TRP001", date: "2025-06-25", source: "Mumbai", destination: "Delhi", status: "Completed", amount: "₹45,000", driver: "John Doe", vehicle: "MH-01-AB-1234" },
    { id: 2, tripId: "TRP002", date: "2025-06-24", source: "Delhi", destination: "Bangalore", status: "In Transit", amount: "₹38,000", driver: "Jane Smith", vehicle: "DL-02-CD-5678" },
    { id: 3, tripId: "TRP003", date: "2025-06-23", source: "Chennai", destination: "Kolkata", status: "Pending", amount: "₹42,000", driver: "Mike Johnson", vehicle: "TN-03-EF-9012" },
    { id: 4, tripId: "TRP004", date: "2025-06-22", source: "Pune", destination: "Hyderabad", status: "Completed", amount: "₹35,000", driver: "Sarah Wilson", vehicle: "MH-04-GH-3456" },
    { id: 5, tripId: "TRP005", date: "2025-06-21", source: "Ahmedabad", destination: "Surat", status: "Cancelled", amount: "₹28,000", driver: "Tom Brown", vehicle: "GJ-05-IJ-7890" }
  ]);

  const dateRanges = [
    { id: "all", name: "All Time" },
    { id: "today", name: "Today" },
    { id: "week", name: "This Week" },
    { id: "month", name: "This Month" },
    { id: "quarter", name: "This Quarter" },
    { id: "year", name: "This Year" }
  ];

  const statusOptions = [
    { id: "all", name: "All Status" },
    { id: "completed", name: "Completed" },
    { id: "in-transit", name: "In Transit" },
    { id: "pending", name: "Pending" },
    { id: "cancelled", name: "Cancelled" }
  ];

  const sortOptions = [
    { id: "date", name: "Date" },
    { id: "amount", name: "Amount" },
    { id: "tripId", name: "Trip ID" },
    { id: "status", name: "Status" }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      "Completed": "bg-green-100 text-green-800",
      "In Transit": "bg-blue-100 text-blue-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Cancelled": "bg-red-100 text-red-800"
    };
    return statusMap[status] || "bg-gray-100 text-gray-800";
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log("Exporting report data...");
  };

  // Filter and sort data
  const filteredData = reportFields.filter(item => {
    const matchesSearch = item.tripId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.driver.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         item.status.toLowerCase().replace(" ", "-") === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!reportName) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Report Data</h1>
            <p className="text-muted-foreground mb-4">Please select a report to view its details.</p>
            <Button onClick={() => navigate("/reports")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => navigate("/reports")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{reportName}</h1>
            </div>
          </div>
          <p className="text-muted-foreground">{reportDescription}</p>
        </div>

        {/* Filters Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters & Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Date Range */}
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map(range => (
                    <SelectItem key={range.id} value={range.id}>{range.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(sort => (
                    <SelectItem key={sort.id} value={sort.id}>{sort.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Report Data ({filteredData.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.tripId}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.source}</TableCell>
                      <TableCell>{row.destination}</TableCell>
                      <TableCell>{row.driver}</TableCell>
                      <TableCell>{row.vehicle}</TableCell>
                      <TableCell className="font-semibold">{row.amount}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(row.status)}>
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No data found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportDetails;
