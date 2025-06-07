"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { mes: "Jul", entradas: 4000, saidas: 2400 },
  { mes: "Ago", entradas: 3000, saidas: 1398 },
  { mes: "Set", entradas: 2000, saidas: 9800 },
  { mes: "Out", entradas: 2780, saidas: 3908 },
  { mes: "Nov", entradas: 1890, saidas: 4800 },
  { mes: "Dez", entradas: 2390, saidas: 3800 },
];

export function MovimentacoesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="entradas"
          stroke="#82ca9d"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="saidas"
          stroke="#ff7c7c"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
