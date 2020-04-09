const express = require("express");
const pool = require("../db/connectDB");
const axios = require("axios");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const getCommits = async (username, day, month, year) => {
  let commitsData = [];
  const res = await axios.get(
    `https://api.github.com/users/${username}/events/public`
  );

  if (res.message) {
    return false;
  }

  for (let i = 0; i < res.data.length; i++) {
    if (res.data[i].type === "PushEvent") {
      const date = new Date(res.data[i].created_at);
      if (
        day >= date.getDate() &&
        month >= date.getMonth() &&
        year >= date.getFullYear()
      ) {
        commitsData.push(true);
      }
    }
  }

  if (commitsData.includes(true)) {
    return true;
  }

  return false;
};

router.post("/", authMiddleware, async (req, res) => {
  const { github_user, day, month, year, points } = req.body;

  try {
    const data = getCommits(github_user, day, month, year);

    if (data) {
      const query = await pool.query(
        "UPDATE users SET githubdate=$1, points=$2 WHERE uid=$3",
        [`'${month}-${day}-${year}'`, points, req.user.id]
      );
    }

    return res.status(201).json({ msg: "success" });
  } catch (error) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const query = await pool.query("SELECT * FROM github WHERE user_id=$1", [
      req.user.id,
    ]);

    return res.status(201).json(query.rows);
  } catch (error) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }
});

module.exports = router;
