import React from 'react';

interface LoadingProps {
  size: 'xs' | 'sm' | 'md' | 'lg';
}

const Loading: React.FC<LoadingProps> = ({ size }) => {
  return <span className={`loading loading-dots loading-${size}`}></span>;
};

export default Loading;
