
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/context/WorkspaceContext';

interface CreateSprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSprintDialog: React.FC<CreateSprintDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { workspace, createSprint } = useWorkspace();
  const [newSprintName, setNewSprintName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreateSprint = async () => {
    if (!newSprintName || !startDate || !endDate) return;
    
    setIsSubmitting(true);
    
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    await createSprint({
      name: newSprintName,
      startDate: startDateTime,
      endDate: endDateTime,
      workspaceId: workspace.id,
      isActive: true
    });
    
    onOpenChange(false);
    setNewSprintName('');
    setStartDate('');
    setEndDate('');
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Sprint</DialogTitle>
          <DialogDescription>
            Define your sprint period and goals.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sprint-name">Sprint Name</Label>
            <Input
              id="sprint-name"
              placeholder="e.g., Sprint 1 - MVP Features"
              value={newSprintName}
              onChange={(e) => setNewSprintName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateSprint}
            disabled={!newSprintName || !startDate || !endDate || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Sprint'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
