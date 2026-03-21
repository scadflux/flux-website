/**
 * Rate Limiter Utility
 * Prevents spam and abuse by limiting actions per time period
 * Uses localStorage for client-side tracking
 */

const RATE_LIMITS = {
  RSVP: { maxAttempts: 3, windowMs: 5 * 60 * 1000 }, // 3 attempts per 5 minutes
  APPLICATION: { maxAttempts: 2, windowMs: 60 * 60 * 1000 }, // 2 attempts per hour
  CONTACT: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
};

/**
 * Check if action is rate limited
 * @param {string} action - Action type (RSVP, APPLICATION, CONTACT)
 * @param {string} identifier - Unique identifier (email or user ID)
 * @returns {Object} { allowed: boolean, remainingTime: number (ms), attemptsLeft: number }
 */
export function checkRateLimit(action, identifier) {
  const limit = RATE_LIMITS[action];
  if (!limit) {
    throw new Error(`Unknown action type: ${action}`);
  }

  const key = `rateLimit_${action}_${identifier}`;
  const now = Date.now();

  // Get stored attempts
  const stored = localStorage.getItem(key);
  const attempts = stored ? JSON.parse(stored) : [];

  // Filter out expired attempts
  const validAttempts = attempts.filter(
    (timestamp) => now - timestamp < limit.windowMs
  );

  // Check if rate limited
  if (validAttempts.length >= limit.maxAttempts) {
    const oldestAttempt = Math.min(...validAttempts);
    const remainingTime = limit.windowMs - (now - oldestAttempt);

    return {
      allowed: false,
      remainingTime,
      attemptsLeft: 0,
      message: `Too many attempts. Please wait ${Math.ceil(
        remainingTime / 1000 / 60
      )} minutes before trying again.`,
    };
  }

  return {
    allowed: true,
    remainingTime: 0,
    attemptsLeft: limit.maxAttempts - validAttempts.length,
    message: '',
  };
}

/**
 * Record an attempt
 * @param {string} action - Action type
 * @param {string} identifier - Unique identifier
 */
export function recordAttempt(action, identifier) {
  const limit = RATE_LIMITS[action];
  if (!limit) {
    throw new Error(`Unknown action type: ${action}`);
  }

  const key = `rateLimit_${action}_${identifier}`;
  const now = Date.now();

  // Get stored attempts
  const stored = localStorage.getItem(key);
  const attempts = stored ? JSON.parse(stored) : [];

  // Add new attempt
  const validAttempts = attempts.filter(
    (timestamp) => now - timestamp < limit.windowMs
  );
  validAttempts.push(now);

  // Store updated attempts
  localStorage.setItem(key, JSON.stringify(validAttempts));
}

/**
 * Clear rate limit for an identifier (useful for testing or admin override)
 * @param {string} action - Action type
 * @param {string} identifier - Unique identifier
 */
export function clearRateLimit(action, identifier) {
  const key = `rateLimit_${action}_${identifier}`;
  localStorage.removeItem(key);
}

/**
 * Format remaining time for display
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted time string
 */
export function formatRemainingTime(ms) {
  const seconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

export default {
  checkRateLimit,
  recordAttempt,
  clearRateLimit,
  formatRemainingTime,
};
