import { FaPlus } from "react-icons/fa";

interface PageHeaderProps {
    title: string;
    subtitle: string;
    buttonText: string;
    onButtonClick: () => void;
}

export function PageHeader({ title, subtitle, buttonText, onButtonClick }: PageHeaderProps) {
    return (
        <div className="page-header">
            <div className="header-title">
                <h2 className="dark:text-white">{title}</h2>
                <span className="header-subtitle">{subtitle}</span>
            </div>
            <button className="btn-primary" onClick={onButtonClick}>
                <FaPlus size={14} /> {buttonText}
            </button>
        </div>
    );
}
