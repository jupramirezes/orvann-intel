import React from 'react';

const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendUp = true,
    accent = 'white',
    size = 'default'
}) => {
    const accentColors = {
        white: 'from-white/10 to-white/5 border-white/10',
        green: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
        amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
        red: 'from-red-500/10 to-red-500/5 border-red-500/20',
    };

    const textColors = {
        white: 'text-white',
        green: 'text-emerald-400',
        amber: 'text-amber-400',
        red: 'text-red-400',
    };

    return (
        <div className={`rounded-2xl bg-gradient-to-br ${accentColors[accent]} border backdrop-blur-sm p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}>
            <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{title}</span>
                {Icon && (
                    <div className={`p-2 rounded-lg bg-white/5 ${textColors[accent]}`}>
                        <Icon size={16} />
                    </div>
                )}
            </div>

            <div className={`${size === 'large' ? 'text-4xl' : 'text-2xl'} font-bold ${textColors[accent]} mb-1`}>
                {value}
            </div>

            {subtitle && (
                <p className="text-xs text-zinc-500">{subtitle}</p>
            )}

            {trend !== undefined && (
                <div className={`flex items-center gap-1 mt-3 text-xs ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    <span>{trendUp ? '↑' : '↓'}</span>
                    <span>{trend}</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
