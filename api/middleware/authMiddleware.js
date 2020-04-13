const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ msg: "You must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, "jwtSecret", (err, payload) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const { user } = payload;

    req.user = user;
    next();
  });
};
