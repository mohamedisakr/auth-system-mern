const express = require("express");

const app = express();

app.get("/api/signup", (request, response) => {
  response.json({ data: "You are ready to signup endpoint" });
});

const port = process.env.port || 8080;
app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
