const express = require("express");
const pool = require("../db/connectDB");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM users ORDER BY id");
    res.send(response.rows);
  } catch (error) {
    res.status(401).send(error);
  }
});

router.post("/", async (req, res) => {
  const { email, username, password, github_user } = req.body;

  try {
    if (
      validator.isEmpty(email) ||
      validator.isEmpty(username) ||
      validator.isEmpty(password)
    ) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
    if (!validator.isEmail(email)) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let user = {
      email,
      username,
      password: hash,
      github_user,
      joined: new Date().toDateString(),
    };

    const response = await pool.query(
      "INSERT INTO users(email, username, password, github_user, joined) VALUES($1, $2, $3, $4, $5) RETURNING uid",
      [user.email, user.username, user.password, user.github_user, user.joined]
    );

    const payload = {
      user: {
        id: response.rows[0].uid,
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
