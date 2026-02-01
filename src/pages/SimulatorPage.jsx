import React, { useState, useEffect, useMemo } from 'react';
import {
    Save,
    RotateCcw,
    TrendingUp,
    Target,
    DollarSign,
    Truck,
    Percent,
    Package,
    Plus,
    X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getProducts, saveQuote, formatCOP, formatPercent } from '../utils/storage';
import { calculateFinancials } from '../utils/calculator';

const SimulatorPage = ({ initialProductId }) => {
    const products = getProducts();

    const [selectedProductId, setSelectedProductId] = useState(initialProductId || products[0]?.id);
    const [quantity, setQuantity] = useState(50);

    // Dynamic Costs State
    const [dynamicCosts, setDynamicCosts] = useState([]);
    const [pvp, setPvp] = useState(0);

    // What If variables
    const [extraShipping, setExtraShipping] = useState(0);
    const [discount, setDiscount] = useState(0);

    const [isSaving, setIsSaving] = useState(false);

    const selectedProduct = products.find(p => p.id === selectedProductId);

    // Load product defaults when selection changes
    useEffect(() => {
        if (selectedProduct) {
            setPvp(selectedProduct.defaultPvp);

            // Deep copy costs to allow local simulation edits
            let initialCosts = [];
            if (selectedProduct.costs) {
                initialCosts = selectedProduct.costs.map(c => ({ ...c }));
            } else {
                // Legacy fallback
                initialCosts = [
                    { id: 'l1', name: 'Tela', value: selectedProduct.fabricCost || 0 },
                    { id: 'l2', name: 'Confección', value: selectedProduct.confectionCost || 0 },
                    { id: 'l3', name: 'Estampado', value: selectedProduct.defaultPrintCost || 0 },
                    { id: 'l4', name: 'Empaque', value: selectedProduct.packagingCost || 0 },
                ];
            }
            setDynamicCosts(initialCosts);
        }
    }, [selectedProductId, products]); // Listen to products to ensure loaded

    const results = useMemo(() => {
        return calculateFinancials({
            quantity,
            costs: dynamicCosts,
            pvp,
            extraShipping,
            discount,
        });
    }, [quantity, dynamicCosts, pvp, extraShipping, discount]);

    const handleReset = () => {
        if (selectedProduct) {
            setPvp(selectedProduct.defaultPvp);
            setQuantity(50);
            setExtraShipping(0);
            setDiscount(0);
            let initialCosts = [];
            if (selectedProduct.costs) {
                initialCosts = selectedProduct.costs.map(c => ({ ...c }));
            }
            setDynamicCosts(initialCosts);
        }
    };

    const handleCostChange = (index, value) => {
        const updated = [...dynamicCosts];
        updated[index] = { ...updated[index], value: Number(value) };
        setDynamicCosts(updated);
    };

    const handleSaveQuote = () => {
        if (!results) return;
        setIsSaving(true);

        saveQuote({
            productId: selectedProduct?.id,
            productName: selectedProduct?.name || 'Custom',
            quantity,
            pvp,
            totalProfit: results.totalProfit,
            netMarginPercent: results.netMarginPercent,
            breakEvenUnits: results.breakEvenUnits,
            totalProductionCost: results.totalProductionCost,
        });

        setTimeout(() => setIsSaving(false), 1500);
    };

    if (products.length === 0) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <div className="text-center">
                    <Package size={48} className="mx-auto text-stone-600 mb-4" />
                    <h2 className="text-xl font-bold text-stone-50 mb-2 font-serif">Sin productos</h2>
                    <p className="text-stone-500">Agrega productos primero para poder simular</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-stone-50 mb-1 font-serif">Simulador de Pedido</h1>
                    <p className="text-stone-500">Calcula márgenes, punto de equilibrio y rentabilidad real</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 text-stone-300 rounded-xl font-medium hover:bg-stone-700 transition-colors"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>
                    <button
                        onClick={handleSaveQuote}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg ${isSaving
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 text-white hover:bg-amber-500 shadow-amber-900/20'
                            }`}
                    >
                        <Save size={16} />
                        {isSaving ? '¡Guardado!' : 'Guardar'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Inputs */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    {/* Product Selector + Quantity */}
                    <div className="bg-stone-800/20 border border-stone-800 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-stone-50 uppercase tracking-wider mb-4 font-serif">Producto Base</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="col-span-2">
                                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-2">Seleccionar Producto</label>
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-50 focus:outline-none focus:border-amber-600 appearance-none"
                                >
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider flex items-center gap-2">
                                    <Package size={14} className="text-stone-400" />
                                    Cantidad
                                </label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-50 text-right font-medium focus:outline-none focus:border-amber-600 transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider flex items-center gap-2">
                                    <DollarSign size={14} className="text-emerald-400" />
                                    PVP Unitario
                                </label>
                                <input
                                    type="number"
                                    value={pvp}
                                    onChange={(e) => setPvp(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-50 text-right font-medium focus:outline-none focus:border-amber-600 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Production Costs - Dynamic List */}
                    <div className="bg-stone-800/20 border border-stone-800 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-stone-50 uppercase tracking-wider font-serif">Costos de Producción</h3>
                            <span className="text-xs text-stone-500">Editables para esta simulación</span>
                        </div>

                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {dynamicCosts.map((cost, index) => (
                                <div key={index} className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-stone-500">{cost.name}</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 text-sm">$</span>
                                        <input
                                            type="number"
                                            value={cost.value}
                                            onChange={(e) => handleCostChange(index, e.target.value)}
                                            className="w-full pl-8 pr-4 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-50 text-right font-medium focus:outline-none focus:border-amber-600 transition-colors"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-stone-800 flex justify-between items-center">
                            <span className="text-sm text-stone-400">Costo Unitario Base</span>
                            <span className="text-lg font-bold text-stone-50">{formatCOP(results.unitProdCost)}</span>
                        </div>
                    </div>

                    {/* What If Panel */}
                    <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-900/30 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Truck size={18} className="text-amber-600" />
                            <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider font-serif">Modo What If</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-amber-600/70 uppercase tracking-wider block mb-2">Envío Extra</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/50 text-sm">+$</span>
                                    <input
                                        type="number"
                                        value={extraShipping}
                                        onChange={(e) => setExtraShipping(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-3 bg-stone-900/50 border border-amber-900/30 rounded-xl text-amber-500 text-right font-medium focus:outline-none focus:border-amber-600/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-amber-600/70 uppercase tracking-wider block mb-2">Descuento</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                        className="w-full pl-4 pr-8 py-3 bg-stone-900/50 border border-amber-900/30 rounded-xl text-amber-500 text-right font-medium focus:outline-none focus:border-amber-600/50"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600/50 text-sm">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div className="col-span-12 lg:col-span-7 space-y-6">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Net Margin */}
                        <div className={`bg-gradient-to-br ${results?.netMarginPercent > 30 ? 'from-emerald-900/20 to-emerald-900/5 border-emerald-900/30' : results?.netMarginPercent > 15 ? 'from-amber-900/20 to-amber-900/5 border-amber-900/30' : 'from-red-900/20 to-red-900/5 border-red-900/30'} border rounded-2xl p-6 shadow-xl`}>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={16} className={results?.netMarginPercent > 30 ? 'text-emerald-500' : results?.netMarginPercent > 15 ? 'text-amber-500' : 'text-red-500'} />
                                <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Margen Neto</span>
                            </div>
                            <div className={`text-4xl font-black ${results?.netMarginPercent > 30 ? 'text-emerald-500' : results?.netMarginPercent > 15 ? 'text-amber-500' : 'text-red-500'} mb-1 font-serif`}>
                                {formatPercent(results?.netMarginPercent || 0)}
                            </div>
                            <div className="text-sm text-stone-400">
                                {formatCOP(results?.netMarginValue || 0)} / unidad
                            </div>
                        </div>

                        {/* Break Even */}
                        <div className="bg-stone-800/30 border border-stone-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Target size={16} className="text-stone-400" />
                                <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Punto Equilibrio</span>
                            </div>
                            <div className="text-4xl font-black text-stone-50 mb-1 font-serif">
                                {results?.breakEvenUnits || 0}
                            </div>
                            <div className="text-sm text-stone-400">
                                unidades para cubrir inversión
                            </div>
                        </div>

                        {/* Total Profit */}
                        <div className={`bg-gradient-to-br ${results?.totalProfit > 0 ? 'from-emerald-900/10 to-emerald-900/5 border-emerald-900/20' : 'from-red-900/10 to-red-900/5 border-red-900/20'} border rounded-2xl p-6`}>
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign size={16} className={results?.totalProfit > 0 ? 'text-emerald-500' : 'text-red-500'} />
                                <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Ganancia Total</span>
                            </div>
                            <div className={`text-3xl font-black ${results?.totalProfit > 0 ? 'text-emerald-500' : 'text-red-500'} mb-1 font-serif`}>
                                {formatCOP(results?.totalProfit || 0)}
                            </div>
                            <div className="text-sm text-stone-400">
                                de {quantity} unidades
                            </div>
                        </div>

                        {/* ROI */}
                        <div className="bg-stone-800/30 border border-stone-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Percent size={16} className="text-stone-400" />
                                <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">ROI</span>
                            </div>
                            <div className="text-3xl font-black text-stone-50 mb-1 font-serif">
                                {formatPercent(results?.roi || 0)}
                            </div>
                            <div className="text-sm text-stone-400">
                                retorno de inversión
                            </div>
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-stone-800/20 border border-stone-800 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-stone-50 uppercase tracking-wider mb-6 font-serif">Desglose del PVP</h3>

                        <div className="flex items-center gap-8">
                            <div className="w-48 h-48 flex-shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={results?.breakdown || []}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {(results?.breakdown || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="#1c1917" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #292524', borderRadius: '12px', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value) => [formatCOP(value), '']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex-1 space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {(results?.breakdown || []).map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-stone-800 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-sm text-stone-400">{item.name}</span>
                                        </div>
                                        <span className="font-medium text-stone-50">{formatCOP(item.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulatorPage;
