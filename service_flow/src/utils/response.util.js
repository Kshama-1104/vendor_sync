const success = (data, message = 'Success', meta = {}) => {
  return {
    success: true,
    message,
    data,
    ...meta
  };
};

const error = (message = 'Error', statusCode = 500, details = {}) => {
  return {
    success: false,
    error: {
      code: details.code || 'ERROR',
      message,
      ...details
    }
  };
};

const paginated = (data, page, limit, total) => {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

module.exports = { success, error, paginated };
