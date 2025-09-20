const TIME_CONSTANTS = {
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000,
  WEEK: 604800000,
} as const;

export const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return 'Never';
  
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / TIME_CONSTANTS.MINUTE);
  const hours = Math.floor(diff / TIME_CONSTANTS.HOUR);
  const days = Math.floor(diff / TIME_CONSTANTS.DAY);
  
  if (diff < TIME_CONSTANTS.MINUTE) return 'Just now';
  if (diff < TIME_CONSTANTS.HOUR) return `${minutes}m ago`;
  if (diff < TIME_CONSTANTS.DAY) return `${hours}h ago`;
  if (diff < TIME_CONSTANTS.WEEK) return `${days}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
};
