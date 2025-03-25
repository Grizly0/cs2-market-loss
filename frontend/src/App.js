import React, { useEffect, useState } from 'react';
import ItemCard from './components/ItemCard';

const API_URL = "/prices"; // Backend et frontend sont sur la même URL sur Render

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setItems)
      .catch(err => console.error("Erreur API:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🔻 CS2 Items qui chutent le plus</h1>
      {items.map(item => (
        <ItemCard key={item.name} item={item} />
      ))}
    </div>
  );
}

export default App;
