import { TrendingUp, AlertTriangle, X, FileText } from 'lucide-react';
import { useState } from 'react';
import SimpleFileUpload from './SimpleFileUpload';
import ExportReportToPDF from './utils/ExportPDF';

function Header({ onFileUpload, uploadError, setUploadError }) {
  const [resetUpload, setResetUpload] = useState(false);
  const handleUploadSuccess = (mappedData) => {
    onFileUpload(mappedData);
  };

  const handleUploadError = (errorMessage) => {
    setUploadError(errorMessage);
  };

  return (
    <>
      <div className="bg-white shadow-lg border-b-2 border-orange-200 p-4">
        <div className='flex flex-col lg:flex-row lg:justify-between gap-2'>
          <div className='flex flex-row gap-2 place-items-center'>
            <div className='p-2 bg-orange-400 rounded-md'>
              <TrendingUp color='white' size={30}/>
            </div>
            <div id='texts'>
              <h1 className="text-2xl font-bold">Smart Media Planner</h1>
              <p className="text-sm text-gray-400">Benchmark & analyze campaigns</p>
            </div>
          </div>
          <div className='flex place-items-center flex-col md:flex-row gap-2'>
            <SimpleFileUpload 
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              resetTrigger={resetUpload}
            />
            <button
              id="export-pdf-btn"
              onClick={ExportReportToPDF}
              className='px-4 py-2 bg-white border border-gray-200 rounded-lg flex flex-row place-items-center gap-2 shadow-sm'>
              <FileText color='black' size={20}/>
              <h2 className="text-base font-bold">Export PDF</h2>
            </button>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
            <p className="text-red-700 font-medium">{uploadError}</p>
            <button
              onClick={() => setUploadError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Header