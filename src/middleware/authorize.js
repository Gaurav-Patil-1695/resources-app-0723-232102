'use strict';

/**
 * RBAC middleware factory.
 * Returns an Express middleware that checks whether req.user
 * holds at least one of the required roles.
 *
 * @param {...string} roles - One or more role strings that are permitted.
 * @returns {Function} Express middleware
 */
function authorize(...roles) {
  return function rbacMiddleware(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Authentication required.',
      });
    }

    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : [req.user.role].filter(Boolean);

    const permitted = roles.some((role) => userRoles.includes(role));

    if (!permitted) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden',
        message: 'You do not have permission to access this resource.',
      });
    }

    return next();
  };
}

module.exports = authorize;
