/**
 * Pagination utility helper
 * Extracts and validates pagination parameters from request query
 */

const getPagination = (page, size) => {
  // Default values
  const defaultPage = 1;
  const defaultSize = 10;
  const maxSize = 100; // Maximum items per page

  // Parse and validate page
  const parsedPage = page ? parseInt(page, 10) : defaultPage;
  const validPage = parsedPage > 0 ? parsedPage : defaultPage;

  // Parse and validate size
  const parsedSize = size ? parseInt(size, 10) : defaultSize;
  const validSize =
    parsedSize > 0 && parsedSize <= maxSize ? parsedSize : defaultSize;

  // Calculate limit and offset
  const limit = validSize;
  const offset = (validPage - 1) * validSize;

  return { limit, offset, page: validPage, size: validSize };
};

/**
 * Format paginated response
 * @param {Object} data - Sequelize findAndCountAll result with rows and count
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Formatted response with pagination metadata
 */
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page;
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    totalItems,
    items,
    totalPages,
    currentPage,
    pageSize: items.length,
    hasNextPage,
    hasPrevPage,
  };
};

module.exports = {
  getPagination,
  getPagingData,
};
