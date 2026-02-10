const paginate = (array, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const paginated = array.slice(offset, offset + limit);

  return {
    data: paginated,
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit)
    }
  };
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const retry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * Math.pow(2, i)); // Exponential backoff
    }
  }
};

module.exports = {
  paginate,
  sleep,
  retry
};


