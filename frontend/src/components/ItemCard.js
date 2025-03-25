import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function ItemCard({ item }) {
  const data = item.history.map((val, i) => ({
    name: `T-${i}`,
    value: val
  }));

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 10,
      padding: 16,
      marginBottom: 20
    }}>
      <h2>{item.name}</h2>
      <p>💸 Prix actuel : {item.current} €</p>
      <p>📉 Perte : {item.loss}%</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#f87171" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ItemCard;
