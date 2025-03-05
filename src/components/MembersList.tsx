
import React from 'react';
import { User } from '@/types';
import { Plus, UserCheck } from 'lucide-react';

interface MembersListProps {
  members: User[];
}

export const MembersList: React.FC<MembersListProps> = ({ members }) => {
  return (
    <div className="glass-panel p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium flex items-center">
          <UserCheck size={18} className="mr-2 text-focus" />
          Team Members
        </h3>
        
        <button className="text-xs bg-focus text-white px-2 py-1 rounded-md flex items-center hover:bg-focus-dark transition-colors">
          <Plus size={14} className="mr-1" />
          Add
        </button>
      </div>
      
      <div className="space-y-3">
        {members.map((member) => (
          <div 
            key={member.id} 
            className="flex items-center p-2.5 rounded-md hover:bg-secondary transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-focus/10 text-focus flex items-center justify-center mr-3">
              <span className="font-medium">{member.name.charAt(0)}</span>
            </div>
            
            <div>
              <div className="font-medium">{member.name}</div>
              <div className="text-xs text-muted-foreground">{member.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
