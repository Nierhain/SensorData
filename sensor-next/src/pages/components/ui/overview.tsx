"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface SensorData {
  id: number;
  timestamp: Date;
  timeLabel: string;
  name?: string;
  value: number;
};
  
export function Overview({data, color}: {data?: SensorData[]; color?: string}) {
  
  if(data){
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="timeLabel"
            stroke="#888888"
            tickLine={false}
            axisLine={false}
          />
          <YAxis />
          <Bar dataKey="value" fill={color} />
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