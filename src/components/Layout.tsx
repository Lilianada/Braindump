
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { cn } from '@/lib/utils';
import { TocItem } from '@/types'; // Import TocItem

const Layout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]); // State for TOC items

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar onToggleSidebar={toggleMobileSidebar} />
      <div className="flex flex-1 pt-16">
        <LeftSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* Pass setTocItems via Outlet context */}
          <Outlet context={{ setTocItems }} /> 
        </main>
        {/* Pass tocItems to RightSidebar */}
        <RightSidebar tocItems={tocItems} /> 
      </div>
    </div>
  );
};

export default Layout;
