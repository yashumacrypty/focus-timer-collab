
import React from 'react';
import { Sidebar } from './Sidebar';
import { useWorkspace } from '@/context/WorkspaceContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { workspace, currentUser } = useWorkspace();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar workspace={workspace} currentUser={currentUser} />
      
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};
