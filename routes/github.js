const express = require("express");
const pool = require("../db/connectDB");
const axios = require("axios");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const getCommits = async (username) => {
  let commitData = [];
  const res = await axios.get(
    `https://api.github.com/users/${username}/events/public`
  );

  for (let i = 0; i < res.data.length; i++) {
    if (res.data[i].type === "PushEvent") {
      const date = new Date(res.data[i].created_at);
      commitData.push({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        commits: res.data[i].payload.size,
      });
    }
  }

  return commitData;
};

router.post("/", authMiddleware, async (req, res) => {
  const { github_user, day, month, year } = req.body;

  try {
    const data = await getCommits(github_user);

    for (let i = 0; i < data.length; i++) {
      if (
        data[i].day >= parseInt(day) &&
        data[i].month >= parseInt(month) &&
        data[i].year >= parseInt(year)
      ) {
        console.log(data[i]);
        const query = await pool.query(
          "INSERT INTO github(activity_date, commits, user_id) VALUES($1, $2, $3)",
          [
            `'${data[i].day}-${data[i].month}-${data[i].year}'`,
            data[i].commits,
            req.user.id,
          ]
        );
      }
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
