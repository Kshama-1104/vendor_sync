const moment = require('moment');

const now = () => {
  return moment();
};

const parsePeriod = (period) => {
  const now = moment();
  let start;

  switch (period) {
    case '1h':
      start = now.clone().subtract(1, 'hour');
      break;
    case '24h':
    case '1d':
      start = now.clone().subtract(1, 'day');
      break;
    case '7d':
      start = now.clone().subtract(7, 'days');
      break;
    case '30d':
      start = now.clone().subtract(30, 'days');
      break;
    case '90d':
      start = now.clone().subtract(90, 'days');
      break;
    default:
      start = now.clone().subtract(7, 'days');
  }

  return {
    start: start.toDate(),
    end: now.toDate()
  };
};

const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

module.exports = {
  now,
  parsePeriod,
  formatDuration
};


