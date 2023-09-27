import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

const data: DataItem[] = [
  { name: 'Category 1', value: 10 },
  { name: 'Category 2', value: 20 },
  { name: 'Category 3', value: 15 },
  { name: 'Category 4', value: 25 },
  { name: 'Category 5', value: 30 },
];

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#d84a68', '#a3a0fb']; // Define colors for bars

const BarChartComponent: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.map((entry, index) => (
          <Bar
            key={entry.name}
            dataKey="value"
            fill={colors[index]} // Set bar color
            label={{ position: 'top' }}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
