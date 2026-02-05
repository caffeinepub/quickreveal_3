import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

const data = [
  { name: 'Lun', val: 120 },
  { name: 'Mar', val: 200 },
  { name: 'Mer', val: 300 },
  { name: 'Jeu', val: 350 },
  { name: 'Ven', val: 500 },
  { name: 'Sam', val: 800 },
  { name: 'Dim', val: 0 }
];

export default function RevenueChart() {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip cursor={false} contentStyle={{ background: '#000', border: 'none', borderRadius: '8px' }} />
          <Area type="monotone" dataKey="val" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVal)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
