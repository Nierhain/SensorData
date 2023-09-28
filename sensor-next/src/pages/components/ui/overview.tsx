"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface SensorData {
    id: number;
    name: string;
    value: number;
  }
  
export function Overview({data}: {data: SensorData[];}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          tickLine={false}
          axisLine={false}
        />
        <YAxis />
        <Bar dataKey="value" fill="#6666ff" />
      </BarChart>
    </ResponsiveContainer>
  )
}