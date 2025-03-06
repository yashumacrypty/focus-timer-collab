
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useWorkspace } from '@/context/WorkspaceContext';
import { SprintsHeader } from '@/components/sprint/SprintsHeader';
import { CreateSprintDialog } from '@/components/sprint/CreateSprintDialog';
import { CurrentSprintOverview } from '@/components/sprint/CurrentSprintOverview';
import { SprintTasksList } from '@/components/sprint/SprintTasksList';
import { NoActiveSprintState } from '@/components/sprint/NoActiveSprintState';

const Sprints = () => {
  const { currentSprint, tasks } = useWorkspace();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const sprintTasks = currentSprint 
    ? tasks.filter(task => task.sprintId === currentSprint.id)
    : [];
  
  return (
    <Layout>
      <SprintsHeader onCreateSprint={() => setCreateDialogOpen(true)} />
      
      {currentSprint ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrentSprintOverview sprint={currentSprint} sprintTasks={sprintTasks} />
          <SprintTasksList tasks={sprintTasks} />
        </div>
      ) : (
        <NoActiveSprintState onCreateSprint={() => setCreateDialogOpen(true)} />
      )}
      
      <CreateSprintDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
    </Layout>
  );
};

export default Sprints;
