"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface SensorData {
    id: number;
    timestamp: Date;
    name: string;
    value: number;
  }
  
export function Overview({data}: {data?: SensorData[];}) {
  
  if(data){
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="timestamp"
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
  
  return (
    <div>
      <p>No Data</p>
    </div>
  )
}