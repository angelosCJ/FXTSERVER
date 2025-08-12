function authMiddleware(req, res, next) {
  console.log('Authorization header:', req.headers.authorization);
  
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token found');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log('Token payload:', payload);
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
}
