import { FaPlus } from "react-icons/fa";

interface PageHeaderProps {
    title: string;
    subtitle: string;
    buttonText: string;
    onButtonClick: () => void;
    buttonDisabled?: boolean;
}

export function PageHeader({ 
    title, 
    subtitle, 
    buttonText, 
    onButtonClick,
    buttonDisabled = false 
}: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-text-dark dark:text-text-light">
                    {title}
                </h2>
                <span className="text-sm text-text-muted">
                    {subtitle}
                </span>
            </div>
            <button 
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white rounded-lg font-medium transition-all duration-200 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                onClick={onButtonClick}
                disabled={buttonDisabled}
            >
                <FaPlus size={14} /> 
                {buttonText}
            </button>
        </div>
    );
}
