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
import { getProducts, getQuotes, getFixedCosts, formatCOP, formatPercent } from '../utils/storage';
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
                    <h1 className="text-3xl font-bold text-stone-50 mb-2 font-serif">Dashboard</h1>
                    <p className="text-stone-400">Vista general de tu catálogo y rentabilidad</p>
                </div>
                <button
                    onClick={() => onNavigate('simulator')}
                    className="flex items-center gap-2 px-5 py-3 bg-stone-100 text-stone-900 rounded-xl font-medium hover:bg-stone-200 transition-colors shadow-lg shadow-black/20"
                >
                    <Zap size={18} />
                    Nueva Simulación
                </button>
            </div>

            {/* Global Financial Status */}
            {(() => {
                const fixedCosts = getFixedCosts().reduce((sum, c) => sum + (c.value || 0), 0);
                const avgTicket = 120000;
                const margin = stats?.avgMargin || 0.4;
                const breakEven = margin > 0 ? Math.ceil(fixedCosts / (avgTicket * margin)) : 0;

                return (
                    <div className="bg-gradient-to-r from-stone-900 to-stone-950 border border-amber-900/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/10 rounded-full text-amber-500">
                                <Target size={24} />
                            </div>
                            <div>
                                <h3 className="text-stone-200 font-serif font-bold text-lg">Objetivo de Supervivencia</h3>
                                <p className="text-stone-500 text-sm">Basado en costos fijos de {formatCOP(fixedCosts)}</p>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <span className="block text-3xl font-bold text-amber-500">{breakEven} <span className="text-sm font-normal text-stone-500">prendas/mes</span></span>
                            <span className="text-xs text-stone-600">Punto de equilibrio global</span>
                        </div>
                        <button onClick={() => onNavigate('finance')} className="text-sm text-stone-400 hover:text-white underline">
                            Ver detalles financieros
                        </button>
                    </div>
                );
            })()}

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
                <div className="rounded-2xl bg-stone-900 border border-stone-800 p-6 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-stone-50 font-serif">Productos Recientes</h2>
                        <button
                            onClick={() => onNavigate('products')}
                            className="text-xs text-stone-400 hover:text-stone-100 flex items-center gap-1 transition-colors"
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
                                <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-stone-800/50 hover:bg-stone-800 transition-colors cursor-pointer" onClick={() => onNavigate('simulator', p.id)}>
                                    <div>
                                        <p className="font-medium text-stone-50 font-serif">{p.name}</p>
                                        <p className="text-xs text-stone-500">{p.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-stone-50">{formatCOP(p.defaultPvp)}</p>
                                        <p className={`text-xs ${result.netMarginPercent > 30 ? 'text-emerald-500' : 'text-stone-400'}`}>
                                            {formatPercent(result.netMarginPercent)} margen
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Quotes */}
                <div className="rounded-2xl bg-stone-900 border border-stone-800 p-6 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-stone-50 font-serif">Cotizaciones Recientes</h2>
                        <button
                            onClick={() => onNavigate('quotes')}
                            className="text-xs text-stone-400 hover:text-stone-100 flex items-center gap-1 transition-colors"
                        >
                            Ver todas <ArrowRight size={14} />
                        </button>
                    </div>

                    {quotes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-stone-500 text-sm">No hay cotizaciones guardadas</p>
                            <button
                                onClick={() => onNavigate('simulator')}
                                className="mt-4 text-xs text-amber-600 hover:text-amber-500 transition-colors font-medium"
                            >
                                Crear primera simulación →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {quotes.slice(0, 4).map(q => (
                                <div key={q.id} className="flex items-center justify-between p-4 rounded-xl bg-stone-800/50 hover:bg-stone-800 transition-colors">
                                    <div>
                                        <p className="font-medium text-stone-50 font-serif">{q.productName}</p>
                                        <p className="text-xs text-stone-500">{q.quantity} unidades</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-500">{formatCOP(q.totalProfit)}</p>
                                        <p className="text-xs text-stone-500">ganancia total</p>
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
