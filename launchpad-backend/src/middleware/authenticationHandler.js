const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const AuthenticationHandler = (req, res, next) => {
  const token = req.headers.authorization;
  if (!req.body) req.body = {};

  if (token) {
    jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET_KEY,
      (err, decoded) => {
        if (decoded) {
          req.body.userId = decoded.userId;
          req.body.full_name = decoded.full_name;
          req.body.userRole = decoded.userRole;
          next();
        } else {
          res.status(401).send({ message: "Invalid token" });
        }
      }
    );
  } else {
    res.status(400).send({ message: "Please login first" });
  }
};

module.exports = { AuthenticationHandler };
