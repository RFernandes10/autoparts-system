import { FaChartLine, FaInbox } from "react-icons/fa";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from "../../contexts/ThemeContext";
import { renderCustomizedLabel, CustomLegend, CustomTooltip } from "./Charts";

export const CategoryDistribution = ({ categorias }: { categorias: { autopecas: number, baterias: number, pneus: number } }) => {
  const { theme } = useTheme();
  const data = [
    { name: 'Autopeças', value: categorias.autopecas },
    { name: 'Baterias', value: categorias.baterias },
    { name: 'Pneus', value: categorias.pneus },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const COLORS = theme === 'dark'
    ? ['#FF8042', '#00C49F', '#0088FE']
    : ['#FF9F40', '#00D1A1', '#3A99FF'];

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
                outerRadius={90}
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
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
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

