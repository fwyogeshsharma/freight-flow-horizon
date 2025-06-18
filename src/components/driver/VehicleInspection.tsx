
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, AlertTriangle, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  label: string;
  status: 'passed' | 'failed' | 'needs_attention' | null;
  notes?: string;
}

const VehicleInspection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inspectionType, setInspectionType] = useState<string>('');
  const [truckId, setTruckId] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'tires', label: 'Tires and Wheels', status: null },
    { id: 'brakes', label: 'Brakes', status: null },
    { id: 'lights', label: 'Lights and Signals', status: null },
    { id: 'mirrors', label: 'Mirrors', status: null },
    { id: 'steering', label: 'Steering', status: null },
    { id: 'engine', label: 'Engine', status: null },
    { id: 'oil', label: 'Oil Level', status: null },
    { id: 'coolant', label: 'Coolant Level', status: null },
    { id: 'belts', label: 'Belts and Hoses', status: null },
    { id: 'battery', label: 'Battery', status: null },
    { id: 'air_pressure', label: 'Air Pressure', status: null },
    { id: 'coupling', label: 'Coupling System', status: null },
    { id: 'cargo_area', label: 'Cargo Area', status: null },
    { id: 'documentation', label: 'Vehicle Documentation', status: null }
  ]);

  const updateChecklistItem = (id: string, status: 'passed' | 'failed' | 'needs_attention') => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const getOverallStatus = (): 'passed' | 'failed' | 'needs_attention' => {
    const statuses = checklist.map(item => item.status).filter(Boolean);
    
    if (statuses.includes('failed')) return 'failed';
    if (statuses.includes('needs_attention')) return 'needs_attention';
    return 'passed';
  };

  const submitInspection = async () => {
    if (!user || !inspectionType || !truckId) {
      toast({
        title: "Missing Information",
        description: "Please fill in inspection type and truck ID",
        variant: "destructive",
      });
      return;
    }

    const incompleteItems = checklist.filter(item => !item.status);
    if (incompleteItems.length > 0) {
      toast({
        title: "Incomplete Inspection",
        description: "Please complete all checklist items",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const inspectionData = {
        driver_id: user.id,
        truck_id: truckId,
        inspection_type: inspectionType,
        status: getOverallStatus(),
        checklist_data: checklist.reduce((acc, item) => {
          acc[item.id] = {
            label: item.label,
            status: item.status,
            notes: item.notes || ''
          };
          return acc;
        }, {} as any),
        notes: notes
      };

      const { error } = await supabase
        .from('vehicle_inspections')
        .insert(inspectionData);

      if (error) throw error;

      toast({
        title: "Inspection Submitted",
        description: "Vehicle inspection has been recorded successfully",
      });

      // Reset form
      setInspectionType('');
      setTruckId('');
      setNotes('');
      setChecklist(prev => prev.map(item => ({ ...item, status: null, notes: '' })));

    } catch (error) {
      console.error('Error submitting inspection:', error);
      toast({
        title: "Error",
        description: "Failed to submit inspection",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'needs_attention':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <div className="h-4 w-4 border rounded-full" />;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'passed': return 'border-green-500 bg-green-50';
      case 'failed': return 'border-red-500 bg-red-50';
      case 'needs_attention': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Vehicle Inspection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Inspection Type</Label>
                <Select value={inspectionType} onValueChange={setInspectionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inspection type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre_trip">Pre-Trip Inspection</SelectItem>
                    <SelectItem value="post_trip">Post-Trip Inspection</SelectItem>
                    <SelectItem value="maintenance">Maintenance Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="truck_id">Truck ID</Label>
                <Input
                  id="truck_id"
                  placeholder="Enter truck ID"
                  value={truckId}
                  onChange={(e) => setTruckId(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Inspection Checklist</h3>
              <div className="grid grid-cols-1 gap-3">
                {checklist.map((item) => (
                  <Card key={item.id} className={`p-4 ${getStatusColor(item.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={item.status === 'passed' ? 'default' : 'outline'}
                          onClick={() => updateChecklistItem(item.id, 'passed')}
                        >
                          Pass
                        </Button>
                        <Button
                          size="sm"
                          variant={item.status === 'needs_attention' ? 'default' : 'outline'}
                          onClick={() => updateChecklistItem(item.id, 'needs_attention')}
                        >
                          Attention
                        </Button>
                        <Button
                          size="sm"
                          variant={item.status === 'failed' ? 'destructive' : 'outline'}
                          onClick={() => updateChecklistItem(item.id, 'failed')}
                        >
                          Fail
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional observations or comments..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-muted-foreground">
                Overall Status: <span className="font-medium">{getOverallStatus().replace('_', ' ').toUpperCase()}</span>
              </div>
              
              <Button
                onClick={submitInspection}
                disabled={submitting || !inspectionType || !truckId}
                className="px-6"
              >
                {submitting ? 'Submitting...' : 'Submit Inspection'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleInspection;
