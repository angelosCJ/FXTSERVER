const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  console.log('Authorization header:', req.headers.authorization);

  if (!req.headers.authorization) {
    console.log('No Authorization header');
    return res.status(401).json({ error: 'Unauthorized - No Authorization header' });
  }

  const token = req.headers.authorization.split(' ')[1];
  console.log('Token extracted:', token);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log('JWT verified. Payload:', payload);
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}

module.exports = authMiddleware;
