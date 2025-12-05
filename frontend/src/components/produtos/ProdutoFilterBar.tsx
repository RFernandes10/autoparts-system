import { FaSearch, FaTools, FaCarBattery } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import type { Produto } from "../../types";

interface ProdutoFilterBarProps {
    busca: string;
    onBuscaChange: (value: string) => void;
    filtroCategoria: string;
    onFiltroCategoriaChange: (value: string) => void;
    produtos: Produto[];
}

export function ProdutoFilterBar({
    busca,
    onBuscaChange,
    filtroCategoria,
    onFiltroCategoriaChange,
    produtos
}: ProdutoFilterBarProps) {
    return (
        <div className="filters-section">
            <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por nome ou código..."
                    value={busca}
                    onChange={(e) => onBuscaChange(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="filtros">
                <button
                    className={filtroCategoria === "TODOS" ? "filtro-btn active" : "filtro-btn"}
                    onClick={() => onFiltroCategoriaChange("TODOS")}
                >
                    Todos <span className="filter-count">({produtos.length})</span>
                </button>
                <button
                    className={filtroCategoria === "AUTOPECA" ? "filtro-btn active autopeca" : "filtro-btn autopeca"}
                    onClick={() => onFiltroCategoriaChange("AUTOPECA")}
                >
                    <FaTools size={14} />
                    Autopeças{" "}
                    <span className="filter-count">
                        ({produtos.filter((p) => p.categoria === "AUTOPECA").length})
                    </span>
                </button>
                <button
                    className={filtroCategoria === "BATERIA" ? "filtro-btn active bateria" : "filtro-btn bateria"}
                    onClick={() => onFiltroCategoriaChange("BATERIA")}
                >
                    <FaCarBattery size={14} />
                    Baterias{" "}
                    <span className="filter-count">
                        ({produtos.filter((p) => p.categoria === "BATERIA").length})
                    </span>
                </button>
                <button
                    className={filtroCategoria === "PNEU" ? "filtro-btn active pneu" : "filtro-btn pneu"}
                    onClick={() => onFiltroCategoriaChange("PNEU")}
                >
                    <GiCarWheel size={16} />
                    Pneus{" "}
                    <span className="filter-count">
                        ({produtos.filter((p) => p.categoria === "PNEU").length})
                    </span>
                </button>
            </div>
        </div>
    );
}
