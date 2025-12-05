import { FaDollarSign } from "react-icons/fa";
import type { Produto } from "../../types";

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const TopProducts = ({ produtosMaisCaros, mostrarValor }: { produtosMaisCaros: Produto[], mostrarValor: boolean }) => {
  if (produtosMaisCaros.length === 0) {
    return null;
  }

  return (
    <div className="card dark:bg-slate-900">
      <div className="card-header">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
          <FaDollarSign className="text-yellow-500" /> Maior Valor em Estoque
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">Top 3 produtos</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {produtosMaisCaros.map((produto, index) => (
          <div
            key={produto.id}
            className="flex items-center gap-3 rounded-lg bg-linear-to-br from-amber-100 to-yellow-200 p-3 transition-transform hover:scale-[1.02] dark:from-amber-900/50 dark:to-yellow-900/30"
          >
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white text-sm font-bold text-amber-500 dark:bg-slate-800 dark:text-amber-400">
              #{index + 1}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-yellow-800 dark:text-amber-200">
                {produto.nome}
              </p>
              <p className="text-xs text-yellow-700 dark:text-amber-400/80">
                {produto.estoqueAtual} unidades
              </p>
            </div>
            <p className="font-bold text-yellow-800 dark:text-amber-200">
              {mostrarValor
                ? formatarMoeda(
                  Number(produto.precoVenda) * produto.estoqueAtual
                )
                : "••••••"}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
};
