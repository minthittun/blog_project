const jwt = require('jsonwebtoken');


const secretKey = "QGLmW5j5CDMIgt7AfTyxpl4gRqtaiHgtEz5LA5Sxo3gxBgVcCTadLnYrZM3zq93m";
const refreshTokenSecret = "uflbK2Zfd12f25OIJuvNp0RnoSbPosb2uEnYMyxMo13lF7bGyygHpiaFeFHINQ5P";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token not provided or invalid format' });
    }
  
    const token = authHeader.split(' ')[1];
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid access token' });
      }
      req.userId = decoded.userId;
      next();
    });
  };

module.exports = { authenticateToken, secretKey, refreshTokenSecret};
