import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmergencyAlert = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alertType, setAlertType] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(coords);
          resolve(coords);
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const sendEmergencyAlert = async (type: string, quickMessage?: string) => {
    if (!user) return;

    setSending(true);

    try {
      let coords = location;
      
      // Try to get current location
      try {
        coords = await getCurrentLocation();
      } catch (error) {
        console.warn('Could not get location:', error);
      }

      const alertData = {
        driver_id: user.id,
        alert_type: type,
        message: quickMessage || message || `${type.charAt(0).toUpperCase() + type.slice(1)} alert from driver`,
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,
        status: 'active'
      };

      const { error } = await supabase
        .from('emergency_alerts')
        .insert(alertData);

      if (error) throw error;

      toast({
        title: "Emergency Alert Sent",
        description: "Your alert has been sent to dispatch immediately.",
        variant: "destructive",
      });

      // Reset form
      setMessage('');
      setAlertType('');

    } catch (error) {
      console.error('Error sending emergency alert:', error);
      toast({
        title: "Error",
        description: "Failed to send emergency alert. Please call dispatch directly.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const sendPanicAlert = () => {
    sendEmergencyAlert('panic', 'PANIC BUTTON PRESSED - IMMEDIATE ASSISTANCE REQUIRED');
  };

  return (
    <div className="space-y-6">
      {/* Panic Button */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Emergency Panic Button</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-red-700">
              Press this button only in case of immediate danger or emergency
            </p>
            <Button
              onClick={sendPanicAlert}
              disabled={sending}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-bold"
            >
              {sending ? 'SENDING ALERT...' : 'PANIC BUTTON'}
            </Button>
            <p className="text-sm text-red-600">
              This will immediately alert dispatch with your location
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Other Emergency Types */}
      <Card>
        <CardHeader>
          <CardTitle>Report Emergency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Emergency Type</label>
              <Select value={alertType} onValueChange={setAlertType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select emergency type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakdown">Vehicle Breakdown</SelectItem>
                  <SelectItem value="accident">Traffic Accident</SelectItem>
                  <SelectItem value="medical">Medical Emergency</SelectItem>
                  <SelectItem value="panic">Panic/Security Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Describe the emergency situation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            {location && (
              <div className="bg-green-50 p-3 rounded-lg flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Location Available</p>
                  <p className="text-xs text-green-600">
                    Your current location will be included in the alert
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={() => alertType && sendEmergencyAlert(alertType)}
              disabled={!alertType || sending}
              className="w-full"
              variant="destructive"
            >
              {sending ? 'Sending Alert...' : 'Send Emergency Alert'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Emergency Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Dispatch Center</p>
                <p className="text-sm text-muted-foreground">24/7 Emergency Support</p>
              </div>
              <Button size="sm" variant="outline">
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Emergency Services</p>
                <p className="text-sm text-muted-foreground">Police, Fire, Medical</p>
              </div>
              <Button size="sm" variant="outline">
                <Phone className="h-3 w-3 mr-1" />
                911
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyAlert;
