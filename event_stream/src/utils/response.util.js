/**
 * Response Utility for standardized API responses
 */

class ResponseUtil {
  /**
   * Create a success response
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @returns {object} Formatted success response
   */
  success(data, message = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create an error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {object} details - Additional error details
   * @returns {object} Formatted error response
   */
  error(message = 'Error', statusCode = 500, details = null) {
    return {
      success: false,
      error: {
        code: statusCode,
        message,
        details
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create a paginated response
   * @param {array} data - Array of items
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total items count
   * @returns {object} Formatted paginated response
   */
  paginated(data, page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new ResponseUtil();
