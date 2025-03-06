
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface NoActiveSprintStateProps {
  onCreateSprint: () => void;
}

export const NoActiveSprintState: React.FC<NoActiveSprintStateProps> = ({ onCreateSprint }) => {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium mb-2">No Active Sprint</h3>
      <p className="text-muted-foreground mb-4">
        Create your first sprint to start tracking your tasks.
      </p>
      <Button onClick={onCreateSprint}>
        <Plus size={16} className="mr-2" />
        Create Sprint
      </Button>
    </div>
  );
};
