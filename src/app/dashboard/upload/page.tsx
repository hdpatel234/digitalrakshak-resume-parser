"use client";

import { useState } from "react";
import { uploadResumeUi } from "@/app/actions/resume.actions";
import { UploadCloud, File, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [provider, setProvider] = useState("Gemini");
  const [model, setModel] = useState("gemini-1.5-pro");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleAction = async (formData: FormData) => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    
    setIsUploading(true);
    formData.append("file", file);
    formData.append("providerName", provider);
    formData.append("modelName", model);

    try {
      await uploadResumeUi(formData);
      // Success is handled by redirect in the action
    } catch (error: any) {
      toast.error(error.message);
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Resume</h1>
        <p className="text-gray-500 mt-2">Submit a PDF, DOC, or DOCX file to instantly extract structured JSON data.</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>1 Credit</strong> will be atomically deducted from your wallet upon a successful parse. If the AI provider fails, no credits are deducted and the system will automatically attempt failover.
        </p>
      </div>

      <form action={handleAction} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select AI Provider</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider Engine</label>
              <select 
                value={provider} 
                onChange={(e) => setProvider(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Gemini">Gemini (Google)</option>
                <option value="OpenAI">OpenAI</option>
                <option value="DeepSeek">DeepSeek</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Selection</label>
              <select 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {provider === "Gemini" && <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>}
                {provider === "OpenAI" && <option value="gpt-4o">GPT-4o</option>}
                {provider === "DeepSeek" && <option value="deepseek-chat">DeepSeek Chat</option>}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">File Upload</h2>
          
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
              ${file ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
          >
            <input 
              type="file" 
              id="fileInput" 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            
            <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center justify-center h-full">
              {file ? (
                <>
                  <File className="w-12 h-12 text-blue-500 mb-4" />
                  <p className="text-lg font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">Drag & drop your resume here</p>
                  <p className="text-sm text-gray-500 mt-1">Supports PDF, DOC, DOCX up to 10MB</p>
                  <span className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Browse Files
                  </span>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={!file || isUploading}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isUploading ? "Processing Engine..." : "Extract Data"}
          </button>
        </div>
      </form>
    </div>
  );
}
