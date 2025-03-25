// Backend: Server Express pour récupérer les prix des objets CS2
// Ce serveur appelle l'API Steam pour obtenir les prix et les stocke temporairement

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;
app.use(cors());

const STEAM_API_URL = "https://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name=";

// Liste des objets à suivre (exemple)
const items = [
    "AK-47 | Redline (Field-Tested)",
    "AWP | Asiimov (Field-Tested)",
    "M4A4 | Howl (Factory New)"
];

let prices = {}; // Stock temporaire des prix

async function fetchPrices() {
    for (let item of items) {
        try {
            let response = await axios.get(STEAM_API_URL + encodeURIComponent(item));
            if (response.data.success) {
                const price = parseFloat(response.data.lowest_price.replace("€", "").replace(",", "."));
                if (!prices[item]) {
                    prices[item] = { old: price, current: price, history: [price] };
                } else {
                    prices[item].old = prices[item].current;
                    prices[item].current = price;
                    prices[item].history.push(price);
                    if (prices[item].history.length > 10) prices[item].history.shift(); // Garde un historique limité
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du prix de", item, error);
        }
    }
    console.log("Prix mis à jour", prices);
}

// Met à jour les prix toutes les 30 minutes
setInterval(fetchPrices, 30 * 60 * 1000);
fetchPrices();

app.get("/prices", (req, res) => {
    let sortedItems = Object.entries(prices).map(([name, { old, current, history }]) => {
        let loss = old > current ? ((old - current) / old) * 100 : 0;
        return { name, old, current, loss: loss.toFixed(2), history };
    }).sort((a, b) => b.loss - a.loss);
    res.json(sortedItems);
});

app.listen(PORT, () => console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`));

