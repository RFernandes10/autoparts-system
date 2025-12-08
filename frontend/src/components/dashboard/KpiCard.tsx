import React from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

// Componente para os cartões de KPI
export const KpiCard = ({
  icon: Icon,
  title,
  value,
  badgeText,
  badgeColor,
  subtitle,
  color,
  children,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  badgeText?: string;
  badgeColor?: string;
  subtitle: string;
  color: "blue" | "yellow" | "green";
  children?: React.ReactNode;
}) => {
  const colorVariants = {
    blue: {
      before: "dark:before:bg-blue-500 before:bg-gradient-to-r from-blue-500 to-blue-600",
      iconWrapper: "dark:bg-blue-900/50 bg-gradient-to-br from-blue-50 to-blue-100",
      icon: "text-blue-500",
      badge: "dark:bg-green-500/20 dark:text-green-300 bg-green-100 text-green-800",
    },
    yellow: {
      before: "dark:before:bg-yellow-500 before:bg-gradient-to-r from-yellow-400 to-orange-500",
      iconWrapper: "dark:bg-yellow-900/50 bg-gradient-to-br from-yellow-50 to-yellow-200",
      icon: "text-yellow-500",
      badge: "dark:bg-red-500/20 dark:text-red-300 bg-red-100 text-red-800 animate-pulse",
    },
    green: {
      before: "dark:before:bg-green-500 before:bg-gradient-to-r from-green-500 to-green-600",
      iconWrapper: "dark:bg-green-900/50 bg-gradient-to-br from-green-50 to-green-200",
      icon: "text-green-600",
      badge: "dark:bg-green-500/20 dark:text-green-300 bg-green-100 text-green-800",
    },
  };

  const variants = colorVariants[color] || colorVariants.blue;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border dark:border-slate-800 border-slate-100 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all duration-300 before:absolute before:left-0 before:right-0 before:top-0 before:h-1 before:opacity-0 before:transition-opacity hover:-translate-y-0.5 hover:shadow-lg hover:before:opacity-100 ${variants.before}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${variants.iconWrapper}`}
        >
          <Icon className={`h-5 w-5 ${variants.icon}`} />
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          {children || (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </span>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              {value}
            </span>
            {badgeText && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                  badgeColor ? badgeColor : variants.badge
                }`}
              >
                {badgeColor?.includes("red") ? (
                  <FaArrowDown size={8} />
                ) : (
                  <FaArrowUp size={8} />
                )}
                {badgeText}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
