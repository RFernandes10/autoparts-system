import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import type { Produto } from "../../types";

export const LowStockAlerts = ({
  produtosEstoqueBaixo,
}: {
  produtosEstoqueBaixo: (Produto & { percentual: number; nivel: string })[];
}) => {
  return (
    <div className="card bg-linear-to-br from-white to-red-50 dark:from-slate-900 dark:to-red-900/20">
      <div className="card-header">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
          <FaExclamationTriangle className="text-red-500" /> Ação Necessária
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {produtosEstoqueBaixo.length === 0
            ? "Todos os produtos em níveis adequados"
            : `${produtosEstoqueBaixo.length} produto(s) precisam de atenção`}
        </span>
      </div>

      {produtosEstoqueBaixo.length > 0 ? (
        <div className="flex flex-col space-y-3">
          {produtosEstoqueBaixo.map((produto) => {
            const nivelCores = {
              critico: {
                badge: "bg-red-600 text-white animate-blink",
                border: "dark:border-red-500 border-red-500",
                progress: "bg-gradient-to-r from-red-600 to-red-700",
              },
              urgente: {
                badge: "bg-orange-500 text-white",
                border: "dark:border-orange-500 border-orange-500",
                progress: "bg-gradient-to-r from-orange-500 to-orange-600",
              },
              baixo: {
                badge: "bg-yellow-500 text-white",
                border: "dark:border-yellow-500 border-yellow-500",
                progress: "bg-gradient-to-r from-yellow-500 to-yellow-600",
              },
            };

            return (
              <div
                key={produto.id}
                className={`rounded-lg border-l-4 bg-white dark:bg-slate-800/50 p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg ${
                  nivelCores[produto.nivel as keyof typeof nivelCores].border
                }`}
              >
                {/* container interno com espaçamento consistente entre blocos */}
                <div className="flex flex-col space-y-3">
                  {/* título e badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {produto.nome}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                        nivelCores[produto.nivel as keyof typeof nivelCores]
                          .badge
                      }`}
                    >
                      {produto.nivel}
                    </span>
                  </div>

                  {/* infos e barra de progresso */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        Atual:{" "}
                        <strong className="text-slate-700 dark:text-slate-300">
                          {produto.estoqueAtual}
                        </strong>
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">
                        •
                      </span>
                      <span>
                        Mínimo:{" "}
                        <strong className="text-slate-700 dark:text-slate-300">
                          {produto.estoqueMinimo}
                        </strong>
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          nivelCores[produto.nivel as keyof typeof nivelCores]
                            .progress
                        }`}
                        style={{
                          width: `${Math.min(produto.percentual, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* botão */}
                  <button className="w-full rounded-md bg-linear-to-r from-blue-500 to-blue-600 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm dark:from-blue-600 dark:to-blue-700">
                    Solicitar Reposição
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-green-50 dark:bg-slate-800/30 rounded-lg border border-green-200 dark:border-green-800/50 space-y-6">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30">
            <FaCheckCircle size={28} />
          </div>

          <p className="text-sm font-medium text-slate-800 dark:text-slate-300 leading-relaxed">
            Parabéns! Todos os produtos estão com estoque adequado.
          </p>
        </div>
      )}
    </div>
  );
};
