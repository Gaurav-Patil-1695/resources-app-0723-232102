const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parse and validate page and limit query parameters.
 *
 * @param {object} query - Express req.query object
 * @returns {{ page: number, limit: number, offset: number }}
 */
function parsePagination(query) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isInteger(page) || page < 1) {
    page = DEFAULT_PAGE;
  }

  if (!Number.isInteger(limit) || limit < 1) {
    limit = DEFAULT_LIMIT;
  }

  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Build a standardised paginated response envelope.
 *
 * @param {Array}  data       - Array of records for the current page
 * @param {number} total      - Total number of matching records
 * @param {number} page       - Current page number
 * @param {number} limit      - Page size
 * @returns {object}
 */
function buildPaginatedResponse(data, total, page, limit) {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

module.exports = {
  parsePagination,
  buildPaginatedResponse,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
