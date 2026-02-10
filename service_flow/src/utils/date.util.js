/**
 * Date Utilities for ServiceFlow
 */

/**
 * Format date to locale string
 */
const formatDate = (date, options = {}) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  });
};

/**
 * Format date with time
 */
const formatDateTime = (date, options = {}) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  });
};

/**
 * Format date to ISO string
 */
const toISOString = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
const getRelativeTime = (date) => {
  if (!date) return null;
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

/**
 * Add hours to date
 */
const addHours = (date, hours) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

/**
 * Add days to date
 */
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add minutes to date
 */
const addMinutes = (date, minutes) => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

/**
 * Get difference between two dates in hours
 */
const diffInHours = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.abs(d2 - d1) / (1000 * 60 * 60);
};

/**
 * Get difference between two dates in days
 */
const diffInDays = (date1, date2) => {
  return diffInHours(date1, date2) / 24;
};

/**
 * Get difference between two dates in minutes
 */
const diffInMinutes = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.abs(d2 - d1) / (1000 * 60);
};

/**
 * Check if date is past
 */
const isPast = (date) => {
  return new Date(date) < new Date();
};

/**
 * Check if date is future
 */
const isFuture = (date) => {
  return new Date(date) > new Date();
};

/**
 * Check if date is today
 */
const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

/**
 * Get start of day
 */
const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 */
const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Calculate business hours between two dates (excluding weekends)
 */
const calculateBusinessHours = (startDate, endDate, hoursPerDay = 8) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let businessHours = 0;
  
  const current = new Date(start);
  while (current < end) {
    const dayOfWeek = current.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessHours += hoursPerDay;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return businessHours;
};

/**
 * Format duration in hours and minutes
 */
const formatDuration = (milliseconds) => {
  if (!milliseconds) return '0m';
  
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Parse duration string to milliseconds (e.g., "4h" -> 14400000)
 */
const parseDuration = (durationStr) => {
  if (!durationStr) return 0;
  
  const match = durationStr.match(/^(\d+)(h|m|d)$/);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'h': return value * 60 * 60 * 1000;
    case 'm': return value * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 0;
  }
};

/**
 * Parse period string (e.g., '7d', '30d', '1m', '1y')
 */
const parsePeriod = (period) => {
  const now = new Date();
  let start = new Date();

  const match = period.match(/^(\d+)([dwmy])$/);
  
  if (!match) {
    start.setDate(now.getDate() - 7);
    return { start, end: now };
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'd':
      start.setDate(now.getDate() - value);
      break;
    case 'w':
      start.setDate(now.getDate() - (value * 7));
      break;
    case 'm':
      start.setMonth(now.getMonth() - value);
      break;
    case 'y':
      start.setFullYear(now.getFullYear() - value);
      break;
    default:
      start.setDate(now.getDate() - 7);
  }

  return { start, end: now };
};

module.exports = {
  formatDate,
  formatDateTime,
  toISOString,
  getRelativeTime,
  addHours,
  addDays,
  addMinutes,
  diffInHours,
  diffInDays,
  diffInMinutes,
  isPast,
  isFuture,
  isToday,
  startOfDay,
  endOfDay,
  calculateBusinessHours,
  formatDuration,
  parseDuration,
  parsePeriod
};
