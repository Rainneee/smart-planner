import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AxiosInstance from "./Axios";

function SimpleFileUpload({ onUploadSuccess, onUploadError, resetTrigger }) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (resetTrigger) {
      setUploadStatus(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [resetTrigger]);
  
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setUploadStatus('uploading');
      
      const response = await AxiosInstance.post('campaigns/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUploadStatus('success');
      console.log(response.data)
      onUploadSuccess(response.data);
      
    } catch (error) {
      setUploadStatus('error');
      onUploadError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      setUploadStatus('error');
      onUploadError('Please upload a CSV or Excel file');
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    uploadFile(file);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold ${
          uploadStatus === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
            : uploadStatus === 'error'
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            : uploading
            ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
        }`}
      >
        {uploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Uploading...</span>
          </>
        ) : uploadStatus === 'success' ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Upload Success!</span>
          </>
        ) : uploadStatus === 'error' ? (
          <>
            <AlertCircle className="w-5 h-5" />
            <span>Upload Failed</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <span>Upload Data</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SimpleFileUpload