import { useTheme } from "../../contexts/ThemeContext";

const RADIAN = Math.PI / 180;

export const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent === 0) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="16px">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const CustomLegend = ({ payload }) => {
  const { theme } = useTheme();
  return (
    <ul className="flex flex-col gap-1 mt-4">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2 text-sm" style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
          {entry.value} ({entry.payload.value})
        </li>
      ))}
    </ul>
  );
};

export const CustomTooltip = ({ active, payload }) => {
  const { theme } = useTheme();
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className={`p-2 border rounded-md shadow-lg ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{`${data.name}: ${data.value}`}</p>
      </div>
    );
  }
  return null;
};