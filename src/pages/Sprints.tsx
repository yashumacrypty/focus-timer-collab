
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { SprintSummary } from '@/components/SprintSummary';
import { useWorkspace } from '@/context/WorkspaceContext';
import { CalendarDays, ListChecks, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const Sprints = () => {
  const { currentSprint, sprints, tasks, workspace, createSprint } = useWorkspace();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sprintTasks = currentSprint 
    ? tasks.filter(task => task.sprintId === currentSprint.id)
    : [];
    
  const completedTasks = sprintTasks.filter(task => task.status === 'done');
  const progressPercentage = sprintTasks.length > 0 
    ? Math.floor((completedTasks.length / sprintTasks.length) * 100) 
    : 0;
  
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
    
    setCreateDialogOpen(false);
    setNewSprintName('');
    setStartDate('');
    setEndDate('');
    setIsSubmitting(false);
  };
  
  return (
    <Layout>
      <div className="mb-6 animate-slide-down">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Sprint Management</h1>
            <p className="text-muted-foreground">
              Track sprint progress and completion
            </p>
          </div>
          
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            New Sprint
          </Button>
        </div>
      </div>
      
      {currentSprint ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5">
            <h3 className="text-base font-medium mb-4 flex items-center">
              <CalendarDays size={18} className="mr-2 text-focus" />
              Current Sprint
            </h3>
            
            <SprintSummary sprint={currentSprint} />
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Sprint Progress</h4>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-focus rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{completedTasks.length} of {sprintTasks.length} tasks completed</span>
                <span>{progressPercentage}%</span>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-5">
            <h3 className="text-base font-medium mb-4 flex items-center">
              <ListChecks size={18} className="mr-2 text-focus" />
              Sprint Tasks
            </h3>
            
            {sprintTasks.length > 0 ? (
              <ul className="space-y-2">
                {sprintTasks.map(task => (
                  <li key={task.id} className="p-3 bg-card rounded-md">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {task.description && task.description.length > 60
                            ? `${task.description.substring(0, 60)}...`
                            : task.description || 'No description'}
                        </p>
                      </div>
                      <div className={`status-badge status-badge-${task.status}`}>
                        {task.status === 'todo' ? 'To Do' : task.status === 'progress' ? 'In Progress' : 'Done'}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No tasks in current sprint
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">No Active Sprint</h3>
          <p className="text-muted-foreground mb-4">
            Create your first sprint to start tracking your tasks.
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            Create Sprint
          </Button>
        </div>
      )}
      
      {/* Create Sprint Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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
              onClick={() => setCreateDialogOpen(false)}
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
    </Layout>
  );
};

export default Sprints;
