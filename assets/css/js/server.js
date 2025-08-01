// server.js
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/films", (req, res) => {
  const rows = db.prepare("SELECT * FROM films").all();
  res.json(rows);
});
