const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const items = [
    'AK-47 | Redline (Field-Tested)',
    'AWP | Asiimov (Battle-Scarred)',
    'M4A1-S | Hyper Beast (Minimal Wear)',
    'Desert Eagle | Blaze (Factory New)',
];

const priceHistory = {};

async function fetchPrices() {
    for (const item of items) {
        const marketName = encodeURIComponent(item);
        const url = `https://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name=${marketName}`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data.success) {
                const currentPrice = parseFloat(data.lowest_price?.replace('€', '').replace(',', '.')) || 0;
                if (!priceHistory[item]) priceHistory[item] = [];
                priceHistory[item].push(currentPrice);
                if (priceHistory[item].length > 10) priceHistory[item].shift();
            }
        } catch (err) {
            console.log(`Erreur avec ${item}:`, err.message);
        }
    }
}

setInterval(fetchPrices, 1000 * 60 * 30); // toutes les 30 minutes
fetchPrices();

app.get('/prices', (req, res) => {
    const result = Object.entries(priceHistory).map(([name, history]) => {
        const current = history[history.length - 1];
        const old = history[0];
        const loss = old ? (((old - current) / old) * 100).toFixed(2) : 0;
        return { name, current, history, loss };
    }).sort((a, b) => b.loss - a.loss);

    res.json(result);
});

app.listen(PORT, () => console.log(`Serveur actif sur http://localhost:${PORT}`));
