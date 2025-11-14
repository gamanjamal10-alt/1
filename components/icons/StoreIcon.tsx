
import React from 'react';

const StoreIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A.75.75 0 0114.25 12h.01a.75.75 0 01.75.75v7.5m-3.75 0v-7.5A.75.75 0 0111.25 12h.01a.75.75 0 01.75.75v7.5m-3.75 0v-7.5A.75.75 0 018.25 12h.01a.75.75 0 01.75.75v7.5m-3.75 0V12A2.25 2.25 0 016.75 9.75h10.5A2.25 2.25 0 0119.5 12v9.75M8.25 21h8.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3.75h15A2.25 2.25 0 0121.75 6v.375c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 6.375V6A2.25 2.25 0 014.5 3.75z" />
    </svg>
);

export default StoreIcon;