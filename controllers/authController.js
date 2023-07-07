const jwt = require('jsonwebtoken');

const requireAdminAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, 'xd');
    console.log(decodedToken);

    if (decodedToken.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    req.user = decodedToken; // Attach the user object to the request for future use
    next();
  } 
  catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};


module.exports = requireAdminAuth;
