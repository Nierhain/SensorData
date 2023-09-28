import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

const data: DataItem[] = [
  { name: 'Category 1', value: 10, color: '#8884d8'},
  { name: 'Category 2', value: 20, color: '#82ca9d'},
  { name: 'Category 3', value: 15, color: '#ffc658'},
  { name: 'Category 4', value: 25, color: '#d84a68'},
  { name: 'Category 5', value: 30, color: '#a3a0fb'},
];


const BarChartComponent: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis dataKey="value"/>
        <Tooltip />
        <Legend />
        {data.map((entry) => (
          <Bar
            key={entry.value}
            dataKey="value"
            fill={entry.color} // Set bar color
            label={{ position: 'top' }}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
