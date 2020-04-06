const express = require("express");
const pool = require("../db/connectDB");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (validator.isEmpty(email) || validator.isEmpty(password)) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    if (!validator.isEmail(email)) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (!user.rowCount > 0) {
      return res.status(401).send("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.rows[0].uid,
      },
    };

    jwt.sign(payload, "jwtSecret", { expiresIn: "2h" }, (err, token) => {
      if (err) {
        throw err;
      }

      return res.status(201).json({ token });
    });
  } catch (error) {
    return res.status(401).json({ msg: error });
  }
});

module.exports = router;
