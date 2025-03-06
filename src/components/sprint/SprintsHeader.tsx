
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SprintsHeaderProps {
  onCreateSprint: () => void;
}

export const SprintsHeader: React.FC<SprintsHeaderProps> = ({ onCreateSprint }) => {
  return (
    <div className="mb-6 animate-slide-down">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Sprint Management</h1>
          <p className="text-muted-foreground">
            Track sprint progress and completion
          </p>
        </div>
        
        <Button onClick={onCreateSprint}>
          <Plus size={16} className="mr-2" />
          New Sprint
        </Button>
      </div>
    </div>
  );
};
