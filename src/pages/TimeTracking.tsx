
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { TimeTracker } from '@/components/TimeTracker';
import { DailyInsights } from '@/components/DailyInsights';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Calendar, Clock } from 'lucide-react';

const TimeTracking = () => {
  const { tasks } = useWorkspace();
  
  return (
    <Layout>
      <div className="mb-6 animate-slide-down">
        <h1 className="text-2xl font-semibold mb-1">Time Tracking</h1>
        <p className="text-muted-foreground">
          Track and analyze your time spent on tasks
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TimeTracker showTaskSelector={true} />
        </div>
        
        <div className="md:col-span-2">
          <DailyInsights tasks={tasks} />
        </div>
      </div>
    </Layout>
  );
};

export default TimeTracking;
