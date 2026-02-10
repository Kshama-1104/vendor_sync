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

module.exports = { paginate };


