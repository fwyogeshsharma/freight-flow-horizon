
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, X, Download } from "lucide-react";
import { useLoadDocuments } from "@/hooks/useLoadDocuments";

interface DocumentUploaderProps {
  loadId: string;
  onDocumentsChange: (documents: any[]) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ loadId, onDocumentsChange }) => {
  const { documents, uploading, uploadDocument, deleteDocument } = useLoadDocuments(loadId !== "new-load" ? loadId : undefined);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  const documentTypes = [
    { value: "invoice", label: "Invoice" },
    { value: "eway_bill", label: "E-Way Bill" },
    { value: "delivery_challan", label: "Delivery Challan" },
    { value: "bill_of_lading", label: "Bill of Lading" },
    { value: "packing_list", label: "Packing List" },
    { value: "quality_certificate", label: "Quality Certificate" },
    { value: "other", label: "Other" },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    if (!selectedDocumentType) {
      alert("Please select a document type first");
      return;
    }

    if (loadId === "new-load") {
      // For new loads, just store file reference temporarily
      const fileArray = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        document_type: selectedDocumentType,
        file_name: file.name,
        file_size: file.size,
        file: file
      }));
      onDocumentsChange([...documents, ...fileArray]);
      return;
    }

    // For existing loads, upload to Supabase
    const file = files[0];
    try {
      await uploadDocument(file, selectedDocumentType, loadId);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (loadId === "new-load") {
      // Remove from temporary array
      const updatedDocs = documents.filter(doc => doc.id !== documentId);
      onDocumentsChange(updatedDocs);
    } else {
      // Delete from Supabase
      await deleteDocument(documentId);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Document Upload</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document Type Selection */}
        <div>
          <Label htmlFor="documentType">Document Type</Label>
          <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/10"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Input
            type="file"
            onChange={handleChange}
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={!selectedDocumentType || uploading}
          />
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              {uploading ? "Uploading..." : "Drag & drop files here or click to browse"}
            </p>
            <p className="text-xs text-gray-500">
              Supports: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Uploaded Documents</h4>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{doc.file_name}</p>
                    <p className="text-xs text-gray-500">
                      {doc.document_type} • {doc.file_size ? formatFileSize(doc.file_size) : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {doc.file_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(doc.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
