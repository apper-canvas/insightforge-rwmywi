import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import Papa from 'papaparse';

const MainFeature = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    // Check if file is CSV
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setLoading(true);
    setError(null);
    setFile(file);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`Error parsing CSV: ${results.errors[0].message}`);
          setLoading(false);
          return;
        }

        // Process the data
        setData(results.data);
        setColumns(results.meta.fields || []);
        setLoading(false);
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
        setLoading(false);
      }
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const renderDataPreview = () => {
    if (!data || data.length === 0) return null;

    // Only show first 5 rows for preview
    const previewData = data.slice(0, 5);

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Data Preview</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead className="bg-surface-100 dark:bg-surface-800">
              <tr>
                {columns.map((column, index) => (
                  <th 
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
              {previewData.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-surface-50 dark:bg-surface-750' : ''}>
                  {columns.map((column, colIndex) => (
                    <td 
                      key={`${rowIndex}-${colIndex}`}
                      className="px-4 py-2 text-sm text-surface-700 dark:text-surface-300"
                    >
                      {row[column] !== null && row[column] !== undefined ? String(row[column]) : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-surface-500 dark:text-surface-400">
          Showing 5 of {data.length} rows
        </div>
      </div>
    );
  };

  return (
    <div>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-surface-300 dark:border-surface-600 hover:border-primary/50 dark:hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center py-8">
          <motion.div 
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center"
            animate={{ scale: isDragging ? 1.1 : 1 }}
          >
            <Upload size={24} className="text-surface-500 dark:text-surface-400" />
          </motion.div>
          <h3 className="text-lg font-semibold mb-2">Upload your CSV file</h3>
          <p className="text-surface-500 dark:text-surface-400 mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".csv"
            className="hidden"
          />
          <button 
            onClick={handleBrowseClick}
            className="btn btn-primary"
          >
            Browse Files
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-4 p-4 bg-surface-100 dark:bg-surface-700 rounded-lg flex items-center">
          <Clock size={20} className="text-primary mr-2" />
          <p>Processing your file...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <p>{error}</p>
        </div>
      )}

      {file && !loading && !error && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center">
          <CheckCircle2 size={20} className="mr-2" />
          <div>
            <p className="font-medium">File uploaded successfully</p>
            <p className="text-sm">{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
          </div>
        </div>
      )}

      {renderDataPreview()}
    </div>
  );
};

export default MainFeature;