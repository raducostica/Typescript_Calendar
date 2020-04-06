const express = require("express");
const pool = require("../db/connectDB");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { task, created_for } = req.body;

  if (task === "" || created_for === "") {
    return res.status(401).json({ msg: "Invalid Information" });
  }
  try {
    let userID = req.user.id;
    const query = await pool.query(
      "INSERT INTO todos(task, created_for, user_id) VALUES($1, $2, $3)",
      [task, created_for, userID]
    );

    return res.status(201).json({ msg: "success" });
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Information" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const query = await pool.query("SELECT * FROM todos WHERE user_id = $1", [
      req.user.id,
    ]);

    res.status(201).json(query.rows);
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Credentials" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { task } = req.body;

  try {
    // check if exists
    const query = await pool.query("UPDATE todos SET task=$1 WHERE tid=$2", [
      task,
      parseInt(req.params.id),
    ]);

    return res.status(201).json({ msg: "success" });
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Credentials" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const query = await pool.query("DELETE FROM todos WHERE tid = $1", [
      parseInt(req.params.id),
    ]);

    return res.status(201).json({ msg: "success" });
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Credentials" });
  }
});

module.exports = router;
