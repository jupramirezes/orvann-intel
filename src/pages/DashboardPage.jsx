import React, { useMemo } from 'react';
import {
    Package,
    TrendingUp,
    DollarSign,
    Target,
    ArrowRight,
    Zap
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { getProducts, getQuotes, formatCOP, formatPercent } from '../utils/storage';
import { calculateFinancials } from '../utils/calculator';

const DashboardPage = ({ onNavigate }) => {
    const products = getProducts();
    const quotes = getQuotes();

    const stats = useMemo(() => {
        if (products.length === 0) return null;

        // Calculate average margin across all products at default values
        let totalMargin = 0;
        let topProduct = null;
        let topMargin = -Infinity;

        products.forEach(p => {
            const result = calculateFinancials({
                quantity: 1,
                fabricCost: p.fabricCost,
                confectionCost: p.confectionCost,
                printingCost: p.defaultPrintCost,
                packagingCost: p.packagingCost,
                pvp: p.defaultPvp,
            });

            totalMargin += result.netMarginPercent;

            if (result.netMarginPercent > topMargin) {
                topMargin = result.netMarginPercent;
                topProduct = { ...p, margin: result.netMarginPercent, profit: result.netMarginValue };
            }
        });

        return {
            avgMargin: totalMargin / products.length,
            topProduct,
            totalProducts: products.length,
            totalQuotes: quotes.length,
        };
    }, [products, quotes]);

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-zinc-500">Vista general de tu catálogo y rentabilidad</p>
                </div>
                <button
                    onClick={() => onNavigate('simulator')}
                    className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-colors"
                >
                    <Zap size={18} />
                    Nueva Simulación
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Productos"
                    value={stats?.totalProducts || 0}
                    subtitle="En catálogo"
                    icon={Package}
                    accent="white"
                />
                <StatCard
                    title="Margen Promedio"
                    value={stats ? formatPercent(stats.avgMargin) : '0%'}
                    subtitle="Neto por producto"
                    icon={TrendingUp}
                    accent={stats?.avgMargin > 30 ? 'green' : stats?.avgMargin > 15 ? 'amber' : 'red'}
                />
                <StatCard
                    title="Producto Top"
                    value={stats?.topProduct?.name || '-'}
                    subtitle={stats?.topProduct ? `${formatPercent(stats.topProduct.margin)} margen` : '-'}
                    icon={Target}
                    accent="green"
                />
                <StatCard
                    title="Cotizaciones"
                    value={stats?.totalQuotes || 0}
                    subtitle="Guardadas"
                    icon={DollarSign}
                    accent="amber"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Products Preview */}
                <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Productos Recientes</h2>
                        <button
                            onClick={() => onNavigate('products')}
                            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            Ver todos <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {products.slice(0, 4).map(p => {
                            const result = calculateFinancials({
                                quantity: 1,
                                fabricCost: p.fabricCost,
                                confectionCost: p.confectionCost,
                                printingCost: p.defaultPrintCost,
                                packagingCost: p.packagingCost,
                                pvp: p.defaultPvp,
                            });

                            return (
                                <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => onNavigate('simulator', p.id)}>
                                    <div>
                                        <p className="font-medium text-white">{p.name}</p>
                                        <p className="text-xs text-zinc-500">{p.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">{formatCOP(p.defaultPvp)}</p>
                                        <p className={`text-xs ${result.netMarginPercent > 30 ? 'text-emerald-400' : 'text-zinc-400'}`}>
                                            {formatPercent(result.netMarginPercent)} margen
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Quotes */}
                <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Cotizaciones Recientes</h2>
                        <button
                            onClick={() => onNavigate('quotes')}
                            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            Ver todas <ArrowRight size={14} />
                        </button>
                    </div>

                    {quotes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-zinc-500 text-sm">No hay cotizaciones guardadas</p>
                            <button
                                onClick={() => onNavigate('simulator')}
                                className="mt-4 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                            >
                                Crear primera simulación →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {quotes.slice(0, 4).map(q => (
                                <div key={q.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                    <div>
                                        <p className="font-medium text-white">{q.productName}</p>
                                        <p className="text-xs text-zinc-500">{q.quantity} unidades</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-400">{formatCOP(q.totalProfit)}</p>
                                        <p className="text-xs text-zinc-500">ganancia total</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
