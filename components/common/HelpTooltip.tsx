
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslations } from '../../hooks/useTranslations';

const HelpTooltip: React.FC = () => {
    const { isHelpVisible, helpContent, helpPosition, hideHelp } = useAppContext();
    const t = useTranslations();

    if (!isHelpVisible || !helpPosition) return null;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={hideHelp}></div>
            <div
                style={{ top: `${helpPosition.top}px`, left: `${helpPosition.left}px` }}
                className="absolute z-50 mt-2 w-64 p-3 bg-white rounded-lg shadow-xl border border-gray-200 animate-fade-in-up"
                role="tooltip"
            >
                <h4 className="font-bold text-primary mb-1 text-sm">{t('aiHelp')}</h4>
                {helpContent ? (
                    <p className="text-sm text-gray-700">{helpContent}</p>
                ) : (
                    <p className="text-sm text-gray-500 animate-pulse">{t('helpLoading')}</p>
                )}
            </div>
        </>
    );
};

export default HelpTooltip;
