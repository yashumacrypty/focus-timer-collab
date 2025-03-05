
import React, { useMemo } from 'react';
import { Task } from '@/types';
import { formatTime, formatTimeHuman, formatDateReadable } from '@/utils/timeUtils';
import { BarChart, AreaChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyInsightsProps {
  tasks: Task[];
}

export const DailyInsights: React.FC<DailyInsightsProps> = ({ tasks }) => {
  // Group time entries by date
  const dailyData = useMemo(() => {
    const entriesByDate = new Map<string, { total: number, tasks: Map<string, number> }>();
    
    tasks.forEach(task => {
      task.timeEntries.forEach(entry => {
        const date = entry.date;
        
        if (!entriesByDate.has(date)) {
          entriesByDate.set(date, { total: 0, tasks: new Map() });
        }
        
        const dateData = entriesByDate.get(date)!;
        dateData.total += entry.duration;
        
        const taskTime = dateData.tasks.get(task.id) || 0;
        dateData.tasks.set(task.id, taskTime + entry.duration);
      });
    });
    
    // Convert to array and sort by date
    return Array.from(entriesByDate.entries())
      .map(([date, data]) => {
        const taskData: Record<string, number> = {};
        data.tasks.forEach((duration, taskId) => {
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            taskData[task.title] = duration / 3600; // Convert seconds to hours
          }
        });
        
        return {
          date,
          displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          total: data.total / 3600, // Convert seconds to hours
          ...taskData
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [tasks]);
  
  // Get task colors for chart
  const taskColors = [
    '#8B5CF6', // focus
    '#06B6D4', // cyan
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#EC4899', // pink
  ];
  
  // Get unique task names across all days
  const taskNames = useMemo(() => {
    const names = new Set<string>();
    dailyData.forEach(day => {
      Object.keys(day).forEach(key => {
        if (key !== 'date' && key !== 'displayDate' && key !== 'total') {
          names.add(key);
        }
      });
    });
    return Array.from(names);
  }, [dailyData]);
  
  // Format tooltip values
  const formatTooltipValue = (value: number) => {
    if (value < 1) {
      return `${Math.round(value * 60)}m`;
    }
    return `${value.toFixed(1)}h`;
  };
  
  // Total hours tracked
  const totalHours = dailyData.reduce((sum, day) => sum + day.total, 0);
  
  return (
    <div className="glass-panel p-5 animate-fade-in">
      <h3 className="text-base font-medium mb-4">Daily Time Distribution</h3>
      
      <div className="mb-6">
        <div className="text-2xl font-medium mb-1">{totalHours.toFixed(1)} hours</div>
        <div className="text-sm text-muted-foreground">Total time tracked</div>
      </div>
      
      {dailyData.length > 0 ? (
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={{ stroke: '#E2E8F0' }}
                label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748B', fontSize: 12 } }}
              />
              <Tooltip 
                formatter={(value: number) => [formatTooltipValue(value), 'Hours']}
                itemStyle={{ fontSize: '12px', padding: '2px 0' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              />
              {taskNames.map((name, index) => (
                <Bar 
                  key={name}
                  dataKey={name}
                  stackId="a"
                  fill={taskColors[index % taskColors.length]}
                  radius={[index === taskNames.length - 1 ? 4 : 0, index === taskNames.length - 1 ? 4 : 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center bg-secondary/50 rounded-lg mb-4">
          <p className="text-muted-foreground">No data available yet</p>
        </div>
      )}
      
      <div className="space-y-2">
        {dailyData.length > 0 ? (
          <div className="max-h-64 overflow-y-auto pr-2">
            {dailyData.map(day => (
              <div key={day.date} className="p-3 rounded-md bg-secondary/50 mb-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{formatDateReadable(new Date(day.date))}</div>
                  <div className="text-sm text-focus font-medium">
                    {formatTooltipValue(day.total)}
                  </div>
                </div>
                
                {Object.keys(day)
                  .filter(key => key !== 'date' && key !== 'displayDate' && key !== 'total')
                  .map((taskName, index) => (
                    <div key={taskName} className="flex justify-between items-center py-1 text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: taskColors[index % taskColors.length] }}
                        ></div>
                        <span className="truncate max-w-[160px]">{taskName}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {formatTooltipValue(day[taskName])}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Start tracking time to see your daily insights
          </p>
        )}
      </div>
    </div>
  );
};
