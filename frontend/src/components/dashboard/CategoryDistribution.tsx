import { FaChartLine, FaInbox } from "react-icons/fa";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from "../../contexts/ThemeContext";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent === 0) return null; // Don't show label for 0% slices
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="16px">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomLegend = ({ payload, theme }) => {
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

export const CategoryDistribution = ({ categorias }: { categorias: { autopecas: number, baterias: number, pneus: number } }) => {
  const { theme } = useTheme();
  const data = [
    { name: 'Autopeças', value: categorias.autopecas },
    { name: 'Baterias', value: categorias.baterias },
    { name: 'Pneus', value: categorias.pneus },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const COLORS = ['#FF8042', '#00C49F', '#0088FE'];

  return (
    <div className="card dark:bg-slate-900">
      <div className="card-header">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
          <FaChartLine className="text-blue-500" /> Distribuição por Categoria
        </h3>
      </div>
      <div style={{ width: '100%', height: 250 }}>
        {total > 0 ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90} // Adjusted radius
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* Tooltip removed */}
              <Legend content={<CustomLegend theme={theme} />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <FaInbox size={32} />
            <p className="mt-2 text-sm font-medium">Nenhum produto para exibir</p>
          </div>
        )}
      </div>
    </div>
  )
};

