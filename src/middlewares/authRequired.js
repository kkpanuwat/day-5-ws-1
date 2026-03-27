const { verifyAccessToken } = require('../auth/jwt');

function authRequired(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing Bearer token' });
  }

  const token = auth.slice('Bearer '.length);
  try {
    req.user = verifyAccessToken(token);
    if (!req.user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authRequired;
