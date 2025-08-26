import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ResponsiveTable = ({ 
  data = [], 
  columns = [], 
  loading = false, 
  animated = false,
  emptyMessage = "No data available",
  loadingRows = 5,
  className = "",
  mobileCardClassName = "",
  desktopTableClassName = "",
  ...props 
}) => {
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: loadingRows }, (_, index) => (
        <div key={index} className="animate-pulse">
          {/* Desktop loading */}
          <div className="hidden md:block h-16 bg-gray-700 rounded"></div>
          {/* Mobile loading */}
          <div className="md:hidden bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div className="text-center py-8 text-gray-400">
      {emptyMessage}
    </div>
  )

  const MobileCard = ({ item, index }) => {
    const cardClassName = typeof mobileCardClassName === 'function' 
      ? mobileCardClassName(item, index) 
      : mobileCardClassName || ''
    
    return (
      <motion.div
        key={item.id || `mobile-${index}`}
        initial={animated ? { opacity: 0, y: 20 } : {}}
        animate={animated ? { opacity: 1, y: 0 } : {}}
        exit={animated ? { opacity: 0, y: -20 } : {}}
        transition={animated ? { duration: 0.3, delay: index * 0.05 } : {}}
        className={`bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200 ${cardClassName}`}
      >
        <div className="space-y-3">
        {columns.map((column, colIndex) => {
          const value = column.accessor ? item[column.accessor] : item
          const displayValue = column.render ? column.render(value, item, index) : value
          
          return (
            <div key={colIndex} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                {column.header}
              </span>
              <div className="text-right">
                {displayValue}
              </div>
            </div>
          )
        })}
        </div>
      </motion.div>
    )
  }

  const DesktopTable = () => (
    <div className="overflow-x-auto">
      <table className={`w-full ${desktopTableClassName}`}>
        <thead>
          <tr className="border-b border-gray-700">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`text-left py-4 px-4 text-sm font-bold text-gold uppercase tracking-wider ${
                  column.headerClassName || ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {animated ? (
            <AnimatePresence>
              {data.map((item, index) => (
                <motion.tr
                  key={item.id || `desktop-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  {columns.map((column, colIndex) => {
                    const value = column.accessor ? item[column.accessor] : item
                    const displayValue = column.render ? column.render(value, item, index) : value
                    
                    return (
                      <td
                        key={colIndex}
                        className={`py-4 px-4 ${column.cellClassName || ''}`}
                      >
                        {displayValue}
                      </td>
                    )
                  })}
                </motion.tr>
              ))}
            </AnimatePresence>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id || `desktop-${index}`}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                {columns.map((column, colIndex) => {
                  const value = column.accessor ? item[column.accessor] : item
                  const displayValue = column.render ? column.render(value, item, index) : value
                  
                  return (
                    <td
                      key={colIndex}
                      className={`py-4 px-4 ${column.cellClassName || ''}`}
                    >
                      {displayValue}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!data || data.length === 0) {
    return <EmptyState />
  }

  return (
    <div className={className} {...props}>
      {/* Mobile View - Card Layout */}
      <div className="md:hidden">
        <div className="space-y-4">
          {animated ? (
            <AnimatePresence>
              {data.map((item, index) => (
                <MobileCard key={item.id || `mobile-${index}`} item={item} index={index} />
              ))}
            </AnimatePresence>
          ) : (
            data.map((item, index) => (
              <MobileCard key={item.id || `mobile-${index}`} item={item} index={index} />
            ))
          )}
        </div>
      </div>

      {/* Desktop View - Traditional Table */}
      <div className="hidden md:block">
        <DesktopTable />
      </div>
    </div>
  )
}

export default ResponsiveTable
