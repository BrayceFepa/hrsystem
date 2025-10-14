const NodeCache = require("node-cache");

// Create cache instance
// stdTTL: standard time to live in seconds (default: 300 seconds = 5 minutes)
// checkperiod: automatic delete check interval in seconds (default: 600 seconds = 10 minutes)
// useClones: create a clone of the data when getting/setting (default: true)
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default cache
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: true,
});

// Cache middleware factory
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Create cache key from request path and query parameters
    const key = `__express__${req.originalUrl || req.url}`;

    // Try to get cached response
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`Cache HIT for ${key}`);
      return res.send(cachedResponse);
    }

    console.log(`Cache MISS for ${key}`);

    // Store original send function
    const originalSend = res.send;

    // Override send function to cache the response
    res.send = function (data) {
      // Cache the response
      cache.set(key, data, duration);

      // Call original send function
      originalSend.call(this, data);
    };

    next();
  };
};

// Clear specific cache pattern
const clearCache = (pattern) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter((key) => key.includes(pattern));

  matchingKeys.forEach((key) => {
    cache.del(key);
  });

  console.log(
    `Cleared ${matchingKeys.length} cache entries matching pattern: ${pattern}`
  );
};

// Clear all cache
const clearAllCache = () => {
  cache.flushAll();
  console.log("All cache cleared");
};

// Get cache stats
const getCacheStats = () => {
  return cache.getStats();
};

module.exports = {
  cache,
  cacheMiddleware,
  clearCache,
  clearAllCache,
  getCacheStats,
};
