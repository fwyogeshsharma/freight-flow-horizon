
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LoadDocument {
  id?: string;
  load_id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  uploaded_by?: string;
  uploaded_at?: string;
}

export const useLoadDocuments = (loadId?: string) => {
  const [documents, setDocuments] = useState<LoadDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!loadId) return;
    
    try {
      const { data, error } = await supabase
        .from('load_documents')
        .select('*')
        .eq('load_id', loadId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive"
      });
    }
  };

  const uploadDocument = async (file: File, documentType: string, loadId: string) => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${loadId}/${documentType}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('load-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('load-documents')
        .getPublicUrl(fileName);

      // Save document record
      const { data, error } = await supabase
        .from('load_documents')
        .insert([{
          load_id: loadId,
          document_type: documentType,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          uploaded_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      await fetchDocuments();
      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('load_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      await fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [loadId]);

  return {
    documents,
    uploading,
    uploadDocument,
    deleteDocument,
    fetchDocuments,
  };
};
