
import React from 'react';

const PackageIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5l.415-.207a.75.75 0 011.085.67V10.5m0 0h6m-6 0a.75.75 0 001.085.67l.415-.207M3 7.5V10.5a.75.75 0 001.085.67l.415-.207M3 13.5V16.5a.75.75 0 001.085.67l.415-.207m11.25-8.25v2.818c0 .285-.11.559-.31.758l-2.118 2.118a.75.75 0 01-.53 0l-2.118-2.118a.75.75 0 01-.31-.758V7.5m6 6V16.5a.75.75 0 001.085.67l.415-.207m-6.75-3.375a.75.75 0 00-1.085.67v2.818c0 .285.11.559.31.758l2.118 2.118a.75.75 0 00.53 0l2.118-2.118a.75.75 0 00.31-.758v-2.818a.75.75 0 00-1.085-.67l-.415.207z" />
    </svg>
);
export default PackageIcon;