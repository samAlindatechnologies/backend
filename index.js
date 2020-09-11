const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ messsage: "Hi" });
});

app.get("/hello", (req, res) => {
  res.json({ messsage: "Hello" });
});
app.get("/bonjour", (req, res) => {
  res.json({ messsage: "Bonjour" });
});

app.all("*", (req, res) => {
  res.json({ messsage: "all routes" });
});
app.listen(3000, () => {
  console.log("Server has started");
});
