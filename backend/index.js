const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ton API (ex: /prices)
app.get("/prices", (req, res) => {
  res.json([
    {
      name: "AK-47 | Redline",
      current: 18.2,
      loss: 13.5,
      history: [21, 20, 19, 18.5, 18.2]
    }
  ]);
});

// 🔥 Sert le build React
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
