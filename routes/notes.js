const express = require("express");
const pool = require("../db/connectDB");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { content, createdon } = req.body;

  if (content === "" || createdon === "") {
    return res.status(401).json({ msg: "Invalid Information" });
  }
  try {
    const query = await pool.query(
      "INSERT INTO notes(content, createdon, userid) VALUES($1, $2, $3)",
      [content, createdon, req.user.id]
    );

    return res.status(201).json({ msg: "success" });
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Information" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const query = await pool.query("SELECT * FROM notes WHERE userid = $1", [
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
    const query = await pool.query(
      "UPDATE notes SET content=$1 WHERE tid=$2 AND userid=$3",
      [task, parseInt(req.params.id), req, user.id]
    );

    return res.status(201).json({ msg: "success" });
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Credentials" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const query = await pool.query("DELETE FROM notes WHERE tid = $1", [
      parseInt(req.params.id),
    ]);

    return res.status(201).json({ msg: "success" });
  } catch (error) {
    return res.status(401).json({ msg: "Invalid Credentials" });
  }
});

module.exports = router;
