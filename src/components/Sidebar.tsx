
import React, { useState } from 'react';
import { User, Workspace } from '@/types';
import { 
  Home, 
  Clock, 
  ListChecks, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  workspace: Workspace;
  currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ workspace, currentUser }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <aside className={`bg-white border-r border-border relative transition-all duration-300 animate-slide-down ${
      collapsed ? 'w-[78px]' : 'w-[240px]'
    }`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className={`h-16 flex items-center px-4 border-b border-border relative ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}>
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-sm bg-focus flex items-center justify-center">
                <span className="text-white text-xs font-bold">{workspace.name.charAt(0)}</span>
              </div>
              <h2 className="font-semibold text-sm truncate">{workspace.name}</h2>
            </div>
          )}
          
          {collapsed && (
            <div className="w-8 h-8 rounded-sm bg-focus flex items-center justify-center">
              <span className="text-white text-sm font-bold">{workspace.name.charAt(0)}</span>
            </div>
          )}
          
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 h-5 w-5 bg-background border border-border rounded-full flex items-center justify-center shadow-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={toggleSidebar}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 pt-4 pb-4">
          <ul className="space-y-1 px-2">
            {[
              { icon: Home, label: 'Dashboard' },
              { icon: ListChecks, label: 'Tasks' },
              { icon: Clock, label: 'Time Tracking' },
              { icon: Calendar, label: 'Sprints' },
              { icon: BarChart3, label: 'Reports' },
              { icon: Users, label: 'Team' },
              { icon: Settings, label: 'Settings' },
            ].map((item, i) => (
              <li key={i}>
                <a 
                  href="#" 
                  className={`flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    i === 0 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  } ${collapsed ? 'justify-center' : 'justify-start'}`}
                >
                  <item.icon size={18} className={collapsed ? '' : 'mr-3'} />
                  {!collapsed && <span>{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User */}
        <div className="px-3 pb-4 pt-2 border-t border-border">
          <div className={`flex ${collapsed ? 'justify-center' : 'items-center space-x-3'}`}>
            <div className="w-8 h-8 rounded-full bg-focus/10 text-focus flex items-center justify-center">
              <span className="font-medium text-sm">{currentUser.name.charAt(0)}</span>
            </div>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
