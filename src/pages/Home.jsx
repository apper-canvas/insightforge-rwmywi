import { useState } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Transform Your Data into <span className="text-gradient">Intelligent Insights</span>
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
            Upload your CSV data and let InsightForge automatically generate the most relevant 
            visualizations with interactive filtering and customization options.
          </p>
        </motion.div>

        <div className="card mb-8">
          <div className="border-b border-surface-200 dark:border-surface-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === 'upload' 
                    ? 'text-primary dark:text-primary-light' 
                    : 'text-surface-500 hover:text-surface-800 dark:hover:text-surface-200'
                }`}
              >
                Upload Data
                {activeTab === 'upload' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-light"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('visualize')}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === 'visualize' 
                    ? 'text-primary dark:text-primary-light' 
                    : 'text-surface-500 hover:text-surface-800 dark:hover:text-surface-200'
                }`}
              >
                Visualize
                {activeTab === 'visualize' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-light"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === 'dashboard' 
                    ? 'text-primary dark:text-primary-light' 
                    : 'text-surface-500 hover:text-surface-800 dark:hover:text-surface-200'
                }`}
              >
                Dashboard
                {activeTab === 'dashboard' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-light"
                  />
                )}
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'upload' && (
              <MainFeature />
            )}
            
            {activeTab === 'visualize' && (
              <div className="text-center py-12">
                <div className="mb-4 text-surface-400 dark:text-surface-500">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm4 2v10h2V7H8zm4 3v7h2v-7h-2zm4-1v8h2V9h-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Data to Visualize</h3>
                <p className="text-surface-500 dark:text-surface-400 mb-4">
                  Upload your CSV data first to generate visualizations
                </p>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="btn btn-primary"
                >
                  Go to Upload
                </button>
              </div>
            )}
            
            {activeTab === 'dashboard' && (
              <div className="text-center py-12">
                <div className="mb-4 text-surface-400 dark:text-surface-500">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm3 2v2h4V7H7zm0 4v2h4v-2H7zm0 4v2h10v-2H7zm6-8v6h4V7h-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Dashboard Empty</h3>
                <p className="text-surface-500 dark:text-surface-400 mb-4">
                  Create visualizations first to build your dashboard
                </p>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="btn btn-primary"
                >
                  Go to Upload
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Intelligent Data Upload</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Simply upload your CSV file and our system will automatically analyze and profile your data.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="w-12 h-12 rounded-full bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Visualization</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Our AI analyzes your data structure and automatically suggests the most relevant chart types.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="w-12 h-12 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Filtering</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Apply dynamic filters to your visualizations and see results update in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;