const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];                      // on recupere le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');              // on le décode
    const userId = decodedToken.userId;                                         // on en ressort userId
    if (req.body.userId && req.body.userId !== userId) {                        // si il y a un userId en req et qu'il est différent du token
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
      res.status(401).json({
        error: new Error('Invalid request!')
      }
    );
  }
};