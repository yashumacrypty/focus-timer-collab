
/**
 * Format seconds into readable time string (HH:MM:SS)
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    remainingSeconds.toString().padStart(2, '0')
  ].join(':');
}

/**
 * Format seconds into human readable format
 * e.g. 2h 30m, 45m, etc.
 */
export function formatTimeHuman(seconds: number): string {
  if (seconds === 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}

/**
 * Format date to yyyy-MM-dd
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format date to readable format (Month DD, YYYY)
 */
export function formatDateReadable(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Get start and end dates for a sprint (7 days)
 */
export function getSprintDates(startDate: Date): { startDate: Date, endDate: Date } {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // 7 days total (including start day)
  
  return { startDate, endDate };
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * Parse time string (HH:MM:SS) to seconds
 */
export function parseTimeToSeconds(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(':').map(part => parseInt(part, 10));
  return (hours * 3600) + (minutes * 60) + seconds;
}

/**
 * Generate an array of dates for a sprint
 */
export function getSprintDaysArray(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}
