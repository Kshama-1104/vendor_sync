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

module.exports = {
  success,
  error
};


