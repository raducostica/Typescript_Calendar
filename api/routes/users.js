const express = require("express");
const pool = require("../db/connectDB");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const response = await pool.query(
      "SELECT uid, email, username, github_user, points, challstart, pointsdate, points, githubdate FROM users WHERE uid=$1",
      [req.user.id]
    );
    return res.status(201).json(response.rows);
  } catch (error) {
    return res.status(500).send(error);
  }
});

const getTotalUser = async () => {
  try {
    const response = await pool.query(`SELECT COUNT(username) FROM users;`);

    return response.rows[0].count;
  } catch (error) {
    return 0;
  }
};

router.get("/leaderboards", authMiddleware, async (req, res) => {
  let page = parseInt(req.query.page);
  // let limit = parseInt(req.query.limit);
  let limit = 10;

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  try {
    const response = await pool.query(
      `SELECT username, points, ROW_NUMBER () OVER (ORDER BY points DESC) FROM users OFFSET ${startIndex} LIMIT ${limit};`
    );

    let total = await getTotalUser();

    let results = {};

    if (endIndex < total) {
      results.next = {
        page: page + 1,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
      };
    }

    results.users = response.rows;

    return res.status(201).json(results);
  } catch (error) {
    console.log(error);
  }
});

// BEGIN CHALLENGE
router.post("/start", authMiddleware, async (req, res) => {
  const { date } = req.body;

  try {
    const response = await pool.query(
      "UPDATE users SET challstart=$1, githubdate=$1 WHERE uid=$2",
      [date, req.user.id]
    );

    return res.status(201).json({ msg: "success" });
  } catch (error) {
    return console.log(error);
  }
});

// REGISTER USER
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
      pointsDate: new Date(),
    };

    const response = await pool.query(
      "INSERT INTO users(email, username, password, github_user, joined, pointsDate) VALUES($1, $2, $3, $4, $5, $6) RETURNING uid",
      [
        user.email,
        user.username,
        user.password,
        user.github_user,
        user.joined,
        user.pointsDate,
      ]
    );

    const payload = {
      user: {
        id: response.rows[0].uid,
      },
    };

    jwt.sign(payload, "jwtSecret", { expiresIn: "1d" }, (err, token) => {
      if (err) {
        throw err;
      }

      return res.status(201).json({ token });
    });
  } catch (error) {
    return res.status(401).json({ msg: error });
  }
});

router.post("/pointsdate", authMiddleware, async (req, res) => {
  const { date, points } = req.body;

  try {
    const response = await pool.query(
      "UPDATE users SET points=$1, pointsDate=$2 WHERE uid=$3",
      [points, date, req.user.id]
    );

    res.status(201).json({ msg: "success" });
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Credentials" });
  }
});

module.exports = router;
