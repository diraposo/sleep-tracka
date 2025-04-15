import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Entry {
  date: string;
  hours: number;
}

const SleepChart = ({ data }: { data: Entry[] }) => {
  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">Sleep Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={sorted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="hours" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepChart;
