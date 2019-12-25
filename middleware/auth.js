
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
console.log(req.header('x-auth-token'));

  // Check for token
  if (!token)
    return res.status(401).json({ msg: 'Tillträde förbjudet!' });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.jwt_key);
    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token, ej giltig' });
  }
}

module.exports = auth;
