const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Snakes And Ledders Home Page");
});

module.exports = router;
