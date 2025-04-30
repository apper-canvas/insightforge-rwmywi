import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-6">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center mx-auto">
              <span className="text-6xl font-bold text-surface-400 dark:text-surface-500">404</span>
            </div>
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 1.5 
              }}
              className="absolute -top-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white"
            >
              <span className="text-xl">!</span>
            </motion.div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;