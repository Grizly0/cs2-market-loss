const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ITEMS = [
  "AK-47 | Redline (Field-Tested)",
  "M4A1-S | Guardian (Minimal Wear)",
  "AWP | Fever Dream (Field-Tested)"
];

async function fetchPrice(itemName) {
  const encoded = encodeURIComponent(itemName);
  const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encoded}`;

  try {
    const res = await axios.get(url);
    const priceText = res.data.lowest_price || res.data.median_price || "";
    const price = parseFloat(priceText.replace("$", "").replace(",", ""));

    return price || null;
  } catch (err) {
    console.error(`Erreur pour ${itemName}`, err.message);
    return null;
  }
}

// 🔁 Simuler un historique en appelant plusieurs fois l’API (à améliorer + tard avec une vraie DB)
app.get("/prices", async (req, res) => {
  const data = await Promise.all(
    ITEMS.map(async (item) => {
      const current = await fetchPrice(item);

      // Fake history pour l’instant, mais proche du vrai prix
      const history = Array.from({ length: 5 }, (_, i) =>
        (current + Math.random() - 0.5).toFixed(2)
      );

      const previous = parseFloat(history[0]);
      const loss = previous
        ? (((previous - current) / previous) * 100).toFixed(2)
        : 0;

      return {
        name: item,
        current,
        history: history.map((p) => parseFloat(p)),
        loss: parseFloat(loss)
      };
    })
  );

  // Tri par perte décroissante
  data.sort((a, b) => b.loss - a.loss);

  res.json(data);
});

// Serve React
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
