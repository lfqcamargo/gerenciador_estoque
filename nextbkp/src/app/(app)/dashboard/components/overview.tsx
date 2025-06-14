"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Jan",
    entradas: Math.floor(Math.random() * 5000) + 1000,
    saidas: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Fev",
    entradas: Math.floor(Math.random() * 5000) + 1000,
    saidas: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    entradas: Math.floor(Math.random() * 5000) + 1000,
    saidas: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Abr",
    entradas: Math.floor(Math.random() * 5000) + 1000,
    saidas: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mai",
    entradas: Math.floor(Math.random() * 5000) + 1000,
    saidas: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    entradas: Math.floor(Math.random() * 5000) + 1000,
    saidas: Math.floor(Math.random() * 5000) + 1000,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="entradas"
          fill="currentColor"
          radius={[0, 0, 0, 0]}
          className="fill-primary"
        />
        <Bar
          dataKey="saidas"
          fill="currentColor"
          radius={[0, 0, 0, 0]}
          className="fill-muted"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
