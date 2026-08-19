'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  showHeader?: boolean;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function PageContainer({
  children,
  className = '',
  title,
  description,
  showHeader = true,
}: PageContainerProps) {
  return (
    <motion.div
      className={`min-h-screen bg-background ${className}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {showHeader && (title || description) && (
          <motion.div
            className="mb-8"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {title && (
              <motion.h1
                className="text-3xl font-bold text-foreground mb-2"
                variants={pageVariants}
              >
                {title}
              </motion.h1>
            )}
            {description && (
              <motion.p
                className="text-lg text-muted-foreground"
                variants={pageVariants}
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        )}
        
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Componente para secciones de página
export function PageSection({
  children,
  className = '',
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <motion.section
      className={`mb-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {title && (
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {title}
        </h2>
      )}
      {children}
    </motion.section>
  );
}

// Componente para cards animadas
export function AnimatedCard({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`bg-card border border-border rounded-lg p-6 shadow-sm ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ 
        y: -2, 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}
