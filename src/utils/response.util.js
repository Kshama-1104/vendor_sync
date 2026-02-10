class ResponseUtil {
  success(data, message = 'Success', statusCode = 200) {
    return {
      success: true,
      message,
      data,
      statusCode
    };
  }

  error(message, statusCode = 500, code = 'ERROR', details = null) {
    const response = {
      success: false,
      error: {
        code,
        message
      },
      statusCode
    };

    if (details) {
      response.error.details = details;
    }

    return response;
  }

  paginated(data, pagination, message = 'Success') {
    return {
      success: true,
      message,
      data,
      pagination,
      statusCode: 200
    };
  }
}

module.exports = new ResponseUtil();


