
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Image, 
  Trash2, 
  Download, 
  Eye,
  Camera,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  status: 'uploading' | 'uploaded' | 'failed';
  category: string;
  description?: string;
}

interface DocumentUploaderProps {
  loadId: string;
  tripId?: string;
  existingDocuments?: DocumentFile[];
  onDocumentsChange: (documents: DocumentFile[]) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  loadId,
  tripId,
  existingDocuments = [],
  onDocumentsChange
}) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentFile[]>(existingDocuments);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const documentCategories = [
    'Invoice',
    'E-Way Bill',
    'Delivery Challan',
    'Bill of Lading',
    'Loading Photos',
    'Delivery Photos',
    'Damage Report',
    'Insurance Documents',
    'Vehicle Documents',
    'Other'
  ];

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!selectedCategory) {
      toast({
        title: "Category Required",
        description: "Please select a document category before uploading.",
        variant: "destructive",
      });
      return;
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      const fileId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newDocument: DocumentFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: '', // Will be set after upload
        uploadedAt: new Date(),
        status: 'uploading',
        category: selectedCategory,
        description: description || undefined
      };

      setDocuments(prev => [...prev, newDocument]);

      try {
        // Simulate file upload - replace with actual Supabase storage upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('loadId', loadId);
        formData.append('category', selectedCategory);
        if (tripId) formData.append('tripId', tripId);
        if (description) formData.append('description', description);

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock successful upload
        const uploadedUrl = URL.createObjectURL(file);
        
        setDocuments(prev => prev.map(doc => 
          doc.id === fileId 
            ? { ...doc, status: 'uploaded' as const, url: uploadedUrl }
            : doc
        ));

        toast({
          title: "Upload Successful",
          description: `${file.name} has been uploaded successfully.`,
        });

      } catch (error) {
        setDocuments(prev => prev.map(doc => 
          doc.id === fileId 
            ? { ...doc, status: 'failed' as const }
            : doc
        ));

        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive",
        });
      }
    });

    await Promise.all(uploadPromises);
    onDocumentsChange(documents);
  }, [selectedCategory, description, loadId, tripId, documents, onDocumentsChange, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const deleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    onDocumentsChange(documents.filter(doc => doc.id !== documentId));
    
    toast({
      title: "Document Deleted",
      description: "Document has been removed successfully.",
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Document Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
          </div>

          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Drag and drop files here, or click to browse
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Supports PDF, Images (JPG, PNG), Word documents
            </p>
            
            <div className="flex justify-center space-x-2">
              <Button variant="outline" className="relative">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </Button>
              
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(doc.type)}
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Badge variant="outline" className="text-xs">
                          {doc.category}
                        </Badge>
                        <span>{formatFileSize(doc.size)}</span>
                        <span>{doc.uploadedAt.toLocaleDateString()}</span>
                      </div>
                      {doc.description && (
                        <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {doc.status === 'uploading' && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    )}
                    {doc.status === 'uploaded' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {doc.status === 'failed' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    
                    {doc.status === 'uploaded' && (
                      <>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUploader;
