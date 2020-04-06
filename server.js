const express = require("express");
const app = express();

// allows you to accept body data e.g req.body
app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/commits", require("./routes/github"));

app.listen(5000, () => {
  console.log("server started on port 5000");
});
