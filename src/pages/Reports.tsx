
import React from 'react';
import { Layout } from '@/components/Layout';
import { useWorkspace } from '@/context/WorkspaceContext';
import { formatTimeHuman } from '@/utils/timeUtils';
import { BarChart, PieChart, AreaChart, Area, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileText, PieChart as PieChartIcon, Users } from 'lucide-react';

const Reports = () => {
  const { tasks, workspace } = useWorkspace();
  
  // Data for status distribution
  const statusDistributionData = [
    { name: 'To Do', value: tasks.filter(task => task.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter(task => task.status === 'progress').length },
    { name: 'Done', value: tasks.filter(task => task.status === 'done').length },
  ];
  
  // Data for user workload
  const userWorkloadData = workspace.members.map(member => {
    const memberTasks = tasks.filter(task => task.doerId === member.id);
    const completedTasks = memberTasks.filter(task => task.status === 'done').length;
    const totalTimeSpent = memberTasks.reduce((total, task) => total + task.totalTimeSpent, 0);
    
    return {
      name: member.name,
      tasks: memberTasks.length,
      completed: completedTasks,
      timeSpent: totalTimeSpent / 3600, // Convert to hours
    };
  });
  
  // Colors for charts
  const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
  const STATUS_COLORS = {
    'To Do': '#F59E0B',
    'In Progress': '#8B5CF6',
    'Done': '#10B981',
  };
  
  return (
    <Layout>
      <div className="mb-6 animate-slide-down">
        <h1 className="text-2xl font-semibold mb-1">Reports</h1>
        <p className="text-muted-foreground">
          Analyze team productivity and task completion
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5">
          <h3 className="text-base font-medium mb-4 flex items-center">
            <PieChartIcon size={18} className="mr-2 text-focus" />
            Task Status Distribution
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center mt-4">
            {statusDistributionData.map((entry, index) => (
              <div key={index} className="flex items-center mx-2">
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] }}
                />
                <span className="text-xs">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-panel p-5">
          <h3 className="text-base font-medium mb-4 flex items-center">
            <Users size={18} className="mr-2 text-focus" />
            Team Workload
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userWorkloadData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#8B5CF6" name="Total Tasks" />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Team Member</th>
                  <th className="text-right py-2">Tasks</th>
                  <th className="text-right py-2">Time Spent</th>
                </tr>
              </thead>
              <tbody>
                {userWorkloadData.map((user, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-2">{user.name}</td>
                    <td className="text-right py-2">{user.tasks}</td>
                    <td className="text-right py-2">{formatTimeHuman(user.timeSpent * 3600)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
