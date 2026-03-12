"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function AnalyticsChart({ data }: { data: any[] | undefined }) {
  if (!data) return null;
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="date"
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
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: "#fff",
                border: '1px solid #ccc',
                borderRadius: '0.5rem'
            }}
        />
        <Bar dataKey="revenue" fill="#000000" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
