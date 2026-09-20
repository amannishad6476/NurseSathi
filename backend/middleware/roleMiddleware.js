const permit = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'recruiter' && !req.user.isApproved) {
      return res.status(403).json({ message: 'Recruiter account is waiting for admin approval' });
    }
    next();
  };
};

module.exports = permit;
