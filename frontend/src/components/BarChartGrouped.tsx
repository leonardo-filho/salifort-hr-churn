import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BarChartGrouped({ data }: { data: any[] }) {
  const salaries = ['low', 'medium', 'high'];
  const colors = {
    low: '#f87171',
    medium: '#facc15',
    high: '#38bdf8',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb40" />
        <XAxis dataKey="name" stroke="#e5e7eb" tick={{ fill: '#e5e7eb' }} />
        <YAxis stroke="#e5e7eb" tick={{ fill: '#e5e7eb' }} label={{ value: 'Taxa (%)', angle: -90, position: 'insideLeft', fill: '#e5e7eb', dy: 30 }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#e5e7eb' }}
          formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
        />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        {salaries.map((s) => (
          <Bar key={s} dataKey={s} fill={colors[s as 'low' | 'medium' | 'high']} name={s.charAt(0).toUpperCase() + s.slice(1)} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
