
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

interface KYCUploadProps {
  userRole: string;
}

const KYCUpload: React.FC<KYCUploadProps> = ({ userRole }) => {
  const [uploading, setUploading] = useState<string>("");
  const [documents, setDocuments] = useState<any[]>([]);
  const { toast } = useToast();

  const getRequiredDocuments = (role: string) => {
    const baseDocuments = ['pan_card', 'aadhaar_card'];
    
    switch (role) {
      case 'fleet_owner':
        return [...baseDocuments, 'gst_certificate', 'bank_proof', 'vehicle_rc', 'insurance_certificate'];
      case 'factory_owner':
        return [...baseDocuments, 'company_registration', 'gst_certificate', 'factory_verification'];
      case 'transport_agent':
        return [...baseDocuments, 'address_proof', 'bank_proof'];
      case 'driver':
        return [...baseDocuments, 'driving_license', 'police_verification'];
      case 'consignee':
        return ['aadhaar_card'];
      default:
        return baseDocuments;
    }
  };

  const documentLabels = {
    pan_card: 'PAN Card',
    aadhaar_card: 'Aadhaar Card',
    driving_license: 'Driving License',
    vehicle_rc: 'Vehicle RC',
    insurance_certificate: 'Insurance Certificate',
    permit: 'Permit',
    gst_certificate: 'GST Certificate',
    company_registration: 'Company Registration',
    bank_proof: 'Bank Account Proof',
    address_proof: 'Address Proof',
    factory_verification: 'Factory Verification',
    police_verification: 'Police Verification'
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    if (!file) return;

    setUploading(documentType);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${supabase.auth.getUser()?.data.user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('kyc_documents')
        .upsert({
          user_id: supabase.auth.getUser()?.data.user?.id,
          document_type: documentType,
          file_url: publicUrl,
          file_name: file.name,
          status: 'pending'
        });

      if (dbError) throw dbError;

      toast({
        title: "Document uploaded successfully",
        description: `${documentLabels[documentType]} has been uploaded for verification.`,
      });

      // Refresh documents list
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading("");
    }
  };

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('user_id', supabase.auth.getUser()?.data.user?.id);

    if (!error && data) {
      setDocuments(data);
    }
  };

  React.useEffect(() => {
    fetchDocuments();
  }, []);

  const requiredDocuments = getRequiredDocuments(userRole);
  
  const getDocumentStatus = (docType: string) => {
    const doc = documents.find(d => d.document_type === docType);
    return doc?.status || 'not_uploaded';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Upload className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-700">Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Uploaded</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>KYC Document Upload</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requiredDocuments.map((docType) => {
          const status = getDocumentStatus(docType);
          return (
            <div key={docType} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(status)}
                <div>
                  <p className="font-medium">{documentLabels[docType]}</p>
                  <p className="text-sm text-muted-foreground">
                    {status === 'not_uploaded' ? 'Required document' : `Status: ${status}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(status)}
                {status !== 'verified' && (
                  <div>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, docType);
                      }}
                      disabled={uploading === docType}
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default KYCUpload;
