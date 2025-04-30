import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Check, AlertCircle, BarChart, PieChart, LineChart, Filter } from 'lucide-react';
import Papa from 'papaparse';

const MainFeature = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [suggestedVisualizations, setSuggestedVisualizations] = useState([]);
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
    
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    setError(null);
    
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    
    setFile(selectedFile);
    
    // Use PapaParse to parse the CSV file correctly
    Papa.parse(selectedFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          setError(`Failed to parse CSV: ${results.errors[0].message}`);
          return;
        }
        
        const headers = results.meta.fields || [];
        const parsedData = results.data.slice(0, 5); // Get first 5 rows for preview
        
        setFileData({
          headers,
          rows: parsedData,
          totalRows: results.data.length
        });
        
        // Start analysis
        analyzeData(headers, results.data);
      },
      error: (error) => {
        setError('Failed to parse CSV. Please check the file format.');
      }
    });
  };

  const analyzeData = (headers, rows) => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      // Analyze column types
      const columnTypes = {};
      
      headers.forEach(header => {
        // Check data samples for type inference
        const sampleValues = rows.slice(0, Math.min(rows.length, 20))
          .map(row => row[header])
          .filter(value => value !== null && value !== undefined && value !== "");
        
        if (sampleValues.length === 0) {
          columnTypes[header] = 'unknown';
          return;
        }
        
        // Check if column contains numeric values
        const isNumeric = sampleValues.every(value => 
          typeof value === 'number' || (typeof value === 'string' && !isNaN(value))
        );
        
        // Check if column contains date values
        const mightBeDate = sampleValues.every(value => {
          if (typeof value === 'number') return false;
          const parsed = new Date(value);
          return !isNaN(parsed.getTime());
        });
        
        if (isNumeric) {
          columnTypes[header] = 'numeric';
        } else if (mightBeDate) {
          columnTypes[header] = 'date';
        } else {
          columnTypes[header] = 'categorical';
        }
      });
      
      // Suggest visualizations based on column types
      const suggestions = [];
      
      // Find numeric columns
      const numericColumns = headers.filter(header => columnTypes[header] === 'numeric');
      
      // Find categorical columns
      const categoricalColumns = headers.filter(header => columnTypes[header] === 'categorical');
      
      // Find date columns
      const dateColumns = headers.filter(header => columnTypes[header] === 'date');
      
      // Suggest bar chart if we have categorical and numeric columns
      if (categoricalColumns.length > 0 && numericColumns.length > 0) {
        suggestions.push({
          type: 'bar',
          title: `${numericColumns[0]} by ${categoricalColumns[0]}`,
          description: 'Compare values across categories',
          icon: BarChart,
          color: 'text-primary'
        });
      }
      
      // Suggest pie chart if we have categorical column
      if (categoricalColumns.length > 0 && numericColumns.length > 0) {
        suggestions.push({
          type: 'pie',
          title: `Distribution of ${numericColumns[0]} across ${categoricalColumns[0]}`,
          description: 'Show proportion of each category',
          icon: PieChart,
          color: 'text-secondary'
        });
      }
      
      // Suggest line chart if we have date and numeric columns
      if (dateColumns.length > 0 && numericColumns.length > 0) {
        suggestions.push({
          type: 'line',
          title: `${numericColumns[0]} over time`,
          description: 'Track changes over time',
          icon: LineChart,
          color: 'text-accent'
        });
      }
      
      // If no specific suggestions, add generic ones
      if (suggestions.length === 0) {
        if (numericColumns.length > 1) {
          suggestions.push({
            type: 'scatter',
            title: `${numericColumns[0]} vs ${numericColumns[1]}`,
            description: 'Explore relationship between variables',
            icon: BarChart,
            color: 'text-primary'
          });
        } else if (numericColumns.length > 0) {
          suggestions.push({
            type: 'bar',
            title: `${numericColumns[0]} Summary`,
            description: 'View distribution of values',
            icon: BarChart,
            color: 'text-primary'
          });
        } else {
          suggestions.push({
            type: 'table',
            title: 'Data Table',
            description: 'View data in tabular format',
            icon: FileText,
            color: 'text-surface-600'
          });
        }
      }
      
      setSuggestedVisualizations(suggestions);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 1500);
  };

  const resetUpload = () => {
    setFile(null);
    setFileData(null);
    setError(null);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setSuggestedVisualizations([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-surface-300 dark:border-surface-600 hover:border-primary/50 dark:hover:border-primary/50'
              }`}
            >
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                <Upload className="w-8 h-8 text-surface-500 dark:text-surface-400" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">Upload Your CSV File</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-6 max-w-md mx-auto">
                Drag and drop your CSV file here, or click the button below to browse your files
              </p>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
                id="csv-upload"
              />
              
              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                htmlFor="csv-upload"
                className="btn btn-primary inline-flex items-center gap-2 cursor-pointer"
              >
                <FileText size={18} />
                <span>Select CSV File</span>
              </motion.label>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-red-500 flex items-center justify-center gap-2"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700">
              <div className="bg-surface-100 dark:bg-surface-800 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{file.name}</h3>
                    <p className="text-sm text-surface-500">
                      {fileData ? `${fileData.totalRows} rows` : ''}
                      {file.size ? ` • ${(file.size / 1024).toFixed(1)} KB` : ''}
                    </p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetUpload}
                  className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                  aria-label="Remove file"
                >
                  <X size={18} className="text-surface-500" />
                </motion.button>
              </div>
              
              {fileData && (
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {fileData.headers.map((header, index) => (
                          <th key={index} className="px-4 py-2 text-left font-medium text-surface-600 dark:text-surface-300 border-b border-surface-200 dark:border-surface-700">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fileData.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-surface-100 dark:border-surface-800 last:border-0">
                          {fileData.headers.map((header, colIndex) => (
                            <td key={colIndex} className="px-4 py-2 text-surface-700 dark:text-surface-300">
                              {row[header]?.toString() || ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {fileData.totalRows > 5 && (
                    <div className="text-center mt-2 text-sm text-surface-500">
                      Showing 5 of {fileData.totalRows} rows
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center py-4">
                    <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3"></div>
                    <p className="text-surface-600 dark:text-surface-400">Analyzing your data...</p>
                  </div>
                ) : analysisComplete ? (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Check size={18} className="text-green-500" />
                      <span className="font-medium">Analysis complete!</span>
                    </div>
                    
                    <h4 className="font-medium mb-3">Suggested Visualizations:</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestedVisualizations.map((viz, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { delay: index * 0.1 }
                          }}
                          whileHover={{ scale: 1.02 }}
                          className="border border-surface-200 dark:border-surface-700 rounded-lg p-4 cursor-pointer hover:shadow-soft transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${viz.color === 'text-primary' ? 'bg-primary/10 dark:bg-primary/20' : viz.color === 'text-secondary' ? 'bg-secondary/10 dark:bg-secondary/20' : 'bg-accent/10 dark:bg-accent/20'}`}>
                              <viz.icon className={`w-5 h-5 ${viz.color}`} />
                            </div>
                            <div>
                              <h5 className="font-medium">{viz.title}</h5>
                              <p className="text-sm text-surface-500 dark:text-surface-400">{viz.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center">
                      <button className="btn btn-outline inline-flex items-center gap-2">
                        <Filter size={16} />
                        <span>Customize</span>
                      </button>
                      
                      <button className="btn btn-primary">
                        Generate All Visualizations
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => analyzeData(fileData.headers, fileData.rows)}
                    className="btn btn-primary w-full"
                  >
                    Analyze Data
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;