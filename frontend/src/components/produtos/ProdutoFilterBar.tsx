import { FaSearch, FaTools, FaCarBattery, FaList, FaGripHorizontal } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import type { Produto } from "../../types";
import './ProdutoFilterBar.css';

interface ProdutoFilterBarProps {
    busca: string;
    onBuscaChange: (value: string) => void;
    filtroCategoria: string;
    onFiltroCategoriaChange: (value: string) => void;
    produtos: Produto[];
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ProdutoFilterBar({
    busca,
    onBuscaChange,
    filtroCategoria,
    onFiltroCategoriaChange,
    produtos,
    viewMode,
    onViewModeChange
}: ProdutoFilterBarProps) {
    return (
        <div className="filter-bar-container">
            <div className="filter-bar-left">
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
            <div className="filter-bar-right">
                <div className="view-mode-toggle">
                    <button 
                        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => onViewModeChange('list')}
                        title="Ver em lista"
                    >
                        <FaList />
                    </button>
                    <button 
                        className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => onViewModeChange('grid')}
                        title="Ver em grade"
                    >
                        <FaGripHorizontal />
                    </button>
                </div>
            </div>
        </div>
    );
}
