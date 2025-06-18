
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Filter, X, Search, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface FilterCriteria {
  searchQuery: string;
  status: string[];
  loadType: string[];
  weightRange: [number, number];
  priceRange: [number, number];
  pickupDate: Date | null;
  deliveryDate: Date | null;
  pickupLocation: string;
  dropLocation: string;
  vehicleType: string[];
  urgency: string[];
  factoryOwner: string;
}

interface AdvancedLoadFiltersProps {
  onFiltersChange: (filters: FilterCriteria) => void;
  totalResults: number;
}

const AdvancedLoadFilters: React.FC<AdvancedLoadFiltersProps> = ({
  onFiltersChange,
  totalResults
}) => {
  const [filters, setFilters] = useState<FilterCriteria>({
    searchQuery: '',
    status: [],
    loadType: [],
    weightRange: [0, 50],
    priceRange: [0, 100000],
    pickupDate: null,
    deliveryDate: null,
    pickupLocation: '',
    dropLocation: '',
    vehicleType: [],
    urgency: [],
    factoryOwner: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = ['Open', 'Assigned', 'In Transit', 'Delivered', 'Cancelled'];
  const loadTypeOptions = ['Steel', 'Chemicals', 'FMCG', 'Electronics', 'Food', 'Cement', 'Textiles'];
  const vehicleTypeOptions = ['Truck', 'Trailer', 'Container', 'Tanker', 'Mini Truck'];
  const urgencyOptions = ['Low', 'Medium', 'High', 'Urgent'];

  const updateFilter = (key: keyof FilterCriteria, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (key: keyof FilterCriteria, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearFilter = (key: keyof FilterCriteria) => {
    if (Array.isArray(filters[key])) {
      updateFilter(key, []);
    } else if (key === 'weightRange' || key === 'priceRange') {
      updateFilter(key, key === 'weightRange' ? [0, 50] : [0, 100000]);
    } else {
      updateFilter(key, key.includes('Date') ? null : '');
    }
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterCriteria = {
      searchQuery: '',
      status: [],
      loadType: [],
      weightRange: [0, 50],
      priceRange: [0, 100000],
      pickupDate: null,
      deliveryDate: null,
      pickupLocation: '',
      dropLocation: '',
      vehicleType: [],
      urgency: [],
      factoryOwner: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.status.length) count++;
    if (filters.loadType.length) count++;
    if (filters.vehicleType.length) count++;
    if (filters.urgency.length) count++;
    if (filters.pickupDate) count++;
    if (filters.deliveryDate) count++;
    if (filters.pickupLocation) count++;
    if (filters.dropLocation) count++;
    if (filters.factoryOwner) count++;
    if (filters.weightRange[0] > 0 || filters.weightRange[1] < 50) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Quick Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                placeholder="Search by load ID, type, destination, or factory owner..."
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Advanced Filters</CardTitle>
            <div className="flex space-x-2">
              <span className="text-sm text-muted-foreground">
                {totalResults} results found
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status and Type Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Status</Label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <Badge
                      key={status}
                      variant={filters.status.includes(status) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter('status', status)}
                    >
                      {status}
                      {filters.status.includes(status) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Load Type</Label>
                <div className="flex flex-wrap gap-2">
                  {loadTypeOptions.map(type => (
                    <Badge
                      key={type}
                      variant={filters.loadType.includes(type) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter('loadType', type)}
                    >
                      {type}
                      {filters.loadType.includes(type) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="pickupLocation"
                    value={filters.pickupLocation}
                    onChange={(e) => updateFilter('pickupLocation', e.target.value)}
                    placeholder="Enter pickup location..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="dropLocation">Drop Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="dropLocation"
                    value={filters.dropLocation}
                    onChange={(e) => updateFilter('dropLocation', e.target.value)}
                    placeholder="Enter drop location..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Date Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Pickup Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.pickupDate ? format(filters.pickupDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.pickupDate || undefined}
                      onSelect={(date) => updateFilter('pickupDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Delivery Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.deliveryDate ? format(filters.deliveryDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.deliveryDate || undefined}
                      onSelect={(date) => updateFilter('deliveryDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Range Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Weight Range: {filters.weightRange[0]} - {filters.weightRange[1]} tons
                </Label>
                <Slider
                  value={filters.weightRange}
                  onValueChange={(value) => updateFilter('weightRange', value)}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Price Range: ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter('priceRange', value)}
                  max={100000}
                  step={1000}
                  className="w-full"
                />
              </div>
            </div>

            {/* Vehicle Type and Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Vehicle Type</Label>
                <div className="flex flex-wrap gap-2">
                  {vehicleTypeOptions.map(type => (
                    <Badge
                      key={type}
                      variant={filters.vehicleType.includes(type) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter('vehicleType', type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Urgency</Label>
                <div className="flex flex-wrap gap-2">
                  {urgencyOptions.map(urgency => (
                    <Badge
                      key={urgency}
                      variant={filters.urgency.includes(urgency) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter('urgency', urgency)}
                    >
                      {urgency}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Factory Owner Filter */}
            <div>
              <Label htmlFor="factoryOwner">Factory Owner</Label>
              <Input
                id="factoryOwner"
                value={filters.factoryOwner}
                onChange={(e) => updateFilter('factoryOwner', e.target.value)}
                placeholder="Filter by factory owner name..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium">Active Filters:</span>
              {filters.searchQuery && (
                <Badge variant="secondary" className="flex items-center">
                  Search: {filters.searchQuery}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => clearFilter('searchQuery')}
                  />
                </Badge>
              )}
              {filters.status.map(status => (
                <Badge key={status} variant="secondary" className="flex items-center">
                  {status}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleArrayFilter('status', status)}
                  />
                </Badge>
              ))}
              {filters.loadType.map(type => (
                <Badge key={type} variant="secondary" className="flex items-center">
                  {type}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleArrayFilter('loadType', type)}
                  />
                </Badge>
              ))}
              {/* Add more active filter badges as needed */}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedLoadFilters;
