function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateCreateUser(req, res, next) {
  const { email, name, password } = req.body ?? {};
  const errors = [];

  if (!isNonEmptyString(email)) {
    errors.push({ field: 'email', reason: 'email is required' });
  } else if (!email.includes('@')) {
    errors.push({ field: 'email', reason: 'email is invalid' });
  }

  if (!isNonEmptyString(name)) {
    errors.push({ field: 'name', reason: 'name is required' });
  } else {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 100) {
      errors.push({ field: 'name', reason: 'name must be 2-100 chars' });
    }
  }

  if (typeof password !== 'string') {
    errors.push({ field: 'password', reason: 'password is required' });
  } else if (password.length < 8 || password.length > 72) {
    errors.push({ field: 'password', reason: 'password must be 8-72 chars' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
}

module.exports = validateCreateUser;