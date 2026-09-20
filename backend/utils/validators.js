const validateRegisterInput = ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    return 'Name, email, and password are required.';
  }
  if (!['nurse', 'recruiter'].includes(role)) {
    return 'Role must be nurse or recruiter.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return null;
};

module.exports = { validateRegisterInput };
