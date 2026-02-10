const paginate = (items, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = items.length;
  
  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: endIndex < total,
      hasPrev: startIndex > 0
    }
  };
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const formatDate = (date) => {
  return new Date(date).toISOString();
};

const calculateSLA = (createdAt, slaHours) => {
  const dueDate = new Date(createdAt);
  dueDate.setHours(dueDate.getHours() + slaHours);
  return dueDate;
};

const isSLABreached = (dueDate) => {
  return new Date() > new Date(dueDate);
};

const calculateDuration = (startDate, endDate = new Date()) => {
  const diff = new Date(endDate) - new Date(startDate);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes, totalMinutes: hours * 60 + minutes };
};

const sortByPriority = (items) => {
  const priorityOrder = { 'critical': 1, 'high': 2, 'medium': 3, 'low': 4 };
  return items.sort((a, b) => (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5));
};

const groupBy = (items, key) => {
  return items.reduce((groups, item) => {
    const value = item[key];
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {});
};

module.exports = {
  paginate,
  generateId,
  formatDate,
  calculateSLA,
  isSLABreached,
  calculateDuration,
  sortByPriority,
  groupBy
};
