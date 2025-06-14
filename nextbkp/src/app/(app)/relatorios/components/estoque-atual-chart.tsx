"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Fixação", value: 35, color: "#8884d8" },
  { name: "Chapas", value: 25, color: "#82ca9d" },
  { name: "Tintas", value: 20, color: "#ffc658" },
  { name: "Elétricos", value: 15, color: "#ff7c7c" },
  { name: "Outros", value: 5, color: "#8dd1e1" },
];

export function EstoqueAtualChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
