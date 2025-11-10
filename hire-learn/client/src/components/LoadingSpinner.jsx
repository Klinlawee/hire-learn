import React from 'react'

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...',
  overlay = false,
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`spinner border-primary-600 ${sizeClasses[size]}`} 
        style={{
          borderTopColor: 'transparent'
        }}
      />
      {text && (
        <p className="mt-3 text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}

// Skeleton Loading Components
export const SkeletonLoader = ({ 
  type = 'card',
  count = 1 
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} className="animate-pulse">
      {type === 'card' && <CardSkeleton />}
      {type === 'text' && <TextSkeleton />}
      {type === 'image' && <ImageSkeleton />}
      {type === 'list' && <ListSkeleton />}
    </div>
  ))

  return <>{skeletons}</>
}

const CardSkeleton = () => (
  <div className="card p-6">
    <div className="flex items-center space-x-4 mb-4">
      <div className="skeleton w-12 h-12 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4"></div>
        <div className="skeleton h-3 w-1/2"></div>
      </div>
    </div>
    <div className="skeleton h-5 w-full mb-3"></div>
    <div className="skeleton h-4 w-2/3 mb-4"></div>
    <div className="flex space-x-2 mb-4">
      <div className="skeleton h-6 w-16 rounded-md"></div>
      <div className="skeleton h-6 w-20 rounded-md"></div>
    </div>
    <div className="skeleton h-10 w-full rounded-lg"></div>
  </div>
)

const TextSkeleton = () => (
  <div className="space-y-3">
    <div className="skeleton h-4 w-full"></div>
    <div className="skeleton h-4 w-5/6"></div>
    <div className="skeleton h-4 w-4/6"></div>
  </div>
)

const ImageSkeleton = () => (
  <div className="skeleton w-full h-48 rounded-lg"></div>
)

const ListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }, (_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
        <div className="skeleton w-12 h-12 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
)

export default LoadingSpinner