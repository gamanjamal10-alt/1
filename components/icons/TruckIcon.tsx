
import React from 'react';

const TruckIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M9 17a2 2 0 100-4 2 2 0 000 4z" />
    <path d="M19 17a2 2 0 100-4 2 2 0 000 4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 17H19a2 2 0 002-2V7a2 2 0 00-2-2H3.366a1 1 0 00-.865.5L1 12v5a2 2 0 002 2h2.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17H9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V5h6v12" />
  </svg>
);
export default TruckIcon;
