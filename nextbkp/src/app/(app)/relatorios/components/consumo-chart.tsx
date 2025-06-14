"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { material: "Parafuso M6", consumo: 450 },
  { material: "Cabo 2.5mm", consumo: 380 },
  { material: "Tinta Branca", consumo: 320 },
  { material: "Chapa Aço", consumo: 280 },
  { material: "Porca M6", consumo: 250 },
  { material: "Fita Isolante", consumo: 220 },
  { material: "Abraçadeira", consumo: 180 },
  { material: "Parafuso M8", consumo: 150 },
];

export function ConsumoChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="material" type="category" width={100} />
        <Tooltip />
        <Bar dataKey="consumo" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
