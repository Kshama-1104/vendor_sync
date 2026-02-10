/**
 * Response Utility
 * Standardized API response format
 */

const responseUtil = {
  /**
   * Success response
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @returns {object} Formatted response
   */
  success(data, message = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Error response
   * @param {string} message - Error message
   * @param {number} code - HTTP status code
   * @param {object} details - Additional error details
   * @returns {object} Formatted error response
   */
  error(message, code = 500, details = null) {
    const response = {
      success: false,
      error: {
        code,
        message
      },
      timestamp: new Date().toISOString()
    };

    if (details) {
      response.error.details = details;
    }

    return response;
  },

  /**
   * Paginated response
   * @param {Array} data - Data array
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total items
   * @returns {object} Formatted paginated response
   */
  paginated(data, page, limit, total) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = responseUtil;
