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
    Scissors,
    Paintbrush,
    Box
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getProducts, saveQuote, formatCOP, formatPercent } from '../utils/storage';
import { calculateFinancials } from '../utils/calculator';

const SimulatorPage = ({ initialProductId }) => {
    const products = getProducts();

    const [selectedProductId, setSelectedProductId] = useState(initialProductId || products[0]?.id);
    const [quantity, setQuantity] = useState(50);

    // All costs are now fully editable
    const [fabricCost, setFabricCost] = useState(0);
    const [confectionCost, setConfectionCost] = useState(0);
    const [printCost, setPrintCost] = useState(0);
    const [packagingCost, setPackagingCost] = useState(2500);
    const [pvp, setPvp] = useState(0);

    // What If variables
    const [extraShipping, setExtraShipping] = useState(0);
    const [discount, setDiscount] = useState(0);

    const [isSaving, setIsSaving] = useState(false);

    const selectedProduct = products.find(p => p.id === selectedProductId);

    // Load product defaults when selection changes
    useEffect(() => {
        if (selectedProduct) {
            setFabricCost(selectedProduct.fabricCost);
            setConfectionCost(selectedProduct.confectionCost);
            setPrintCost(selectedProduct.defaultPrintCost);
            setPackagingCost(selectedProduct.packagingCost);
            setPvp(selectedProduct.defaultPvp);
        }
    }, [selectedProductId]);

    const results = useMemo(() => {
        return calculateFinancials({
            quantity,
            fabricCost,
            confectionCost,
            printingCost: printCost,
            packagingCost,
            pvp,
            extraShipping,
            discount,
        });
    }, [quantity, fabricCost, confectionCost, printCost, packagingCost, pvp, extraShipping, discount]);

    const handleReset = () => {
        if (selectedProduct) {
            setFabricCost(selectedProduct.fabricCost);
            setConfectionCost(selectedProduct.confectionCost);
            setPrintCost(selectedProduct.defaultPrintCost);
            setPackagingCost(selectedProduct.packagingCost);
            setPvp(selectedProduct.defaultPvp);
            setQuantity(50);
            setExtraShipping(0);
            setDiscount(0);
        }
    };

    const handleSaveQuote = () => {
        if (!results) return;
        setIsSaving(true);

        saveQuote({
            productId: selectedProduct?.id,
            productName: selectedProduct?.name || 'Custom',
            quantity,
            pvp,
            fabricCost,
            confectionCost,
            printCost,
            packagingCost,
            extraShipping,
            discount,
            totalProfit: results.totalProfit,
            netMarginPercent: results.netMarginPercent,
            breakEvenUnits: results.breakEvenUnits,
            totalProductionCost: results.totalProductionCost,
        });

        setTimeout(() => setIsSaving(false), 1500);
    };

    const InputField = ({ label, value, onChange, icon: Icon, prefix = '$', color = 'white' }) => (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                {Icon && <Icon size={14} className={`text-${color}`} />}
                {label}
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">{prefix}</span>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-right font-medium focus:outline-none focus:border-zinc-600 transition-colors"
                />
            </div>
        </div>
    );

    if (products.length === 0) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <div className="text-center">
                    <Package size={48} className="mx-auto text-zinc-600 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Sin productos</h2>
                    <p className="text-zinc-500">Agrega productos primero para poder simular</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 h-screen overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Simulador de Pedido</h1>
                    <p className="text-zinc-500">Calcula márgenes, punto de equilibrio y rentabilidad real</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition-colors"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>
                    <button
                        onClick={handleSaveQuote}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${isSaving
                                ? 'bg-emerald-500 text-black'
                                : 'bg-white text-black hover:bg-zinc-200'
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
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Producto Base</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="col-span-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Plantilla</label>
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-600"
                                >
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <InputField
                                label="Cantidad"
                                value={quantity}
                                onChange={setQuantity}
                                icon={Package}
                                prefix=""
                            />

                            <InputField
                                label="PVP (Precio Venta)"
                                value={pvp}
                                onChange={setPvp}
                                icon={DollarSign}
                                color="emerald-400"
                            />
                        </div>
                    </div>

                    {/* Production Costs - All Editable */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Costos de Producción</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Tela"
                                value={fabricCost}
                                onChange={setFabricCost}
                                icon={Scissors}
                            />
                            <InputField
                                label="Confección"
                                value={confectionCost}
                                onChange={setConfectionCost}
                                icon={Package}
                            />
                            <InputField
                                label="Estampado"
                                value={printCost}
                                onChange={setPrintCost}
                                icon={Paintbrush}
                            />
                            <InputField
                                label="Empaque"
                                value={packagingCost}
                                onChange={setPackagingCost}
                                icon={Box}
                            />
                        </div>

                        <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
                            <span className="text-sm text-zinc-400">Costo Unitario Base</span>
                            <span className="text-lg font-bold text-white">{formatCOP(fabricCost + confectionCost + printCost + packagingCost)}</span>
                        </div>
                    </div>

                    {/* What If Panel */}
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Truck size={18} className="text-amber-400" />
                            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Modo What If</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-amber-400/70 uppercase tracking-wider block mb-2">Envío Extra</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50 text-sm">+$</span>
                                    <input
                                        type="number"
                                        value={extraShipping}
                                        onChange={(e) => setExtraShipping(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-3 bg-black/30 border border-amber-500/30 rounded-xl text-amber-400 text-right font-medium focus:outline-none focus:border-amber-500/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-amber-400/70 uppercase tracking-wider block mb-2">Descuento</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                        className="w-full pl-4 pr-8 py-3 bg-black/30 border border-amber-500/30 rounded-xl text-amber-400 text-right font-medium focus:outline-none focus:border-amber-500/50"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500/50 text-sm">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div className="col-span-12 lg:col-span-7 space-y-6">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Net Margin - Large Card */}
                        <div className={`bg-gradient-to-br ${results?.netMarginPercent > 30 ? 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30' : results?.netMarginPercent > 15 ? 'from-amber-500/20 to-amber-500/5 border-amber-500/30' : 'from-red-500/20 to-red-500/5 border-red-500/30'} border rounded-2xl p-6`}>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={16} className={results?.netMarginPercent > 30 ? 'text-emerald-400' : results?.netMarginPercent > 15 ? 'text-amber-400' : 'text-red-400'} />
                                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Margen Neto</span>
                            </div>
                            <div className={`text-4xl font-black ${results?.netMarginPercent > 30 ? 'text-emerald-400' : results?.netMarginPercent > 15 ? 'text-amber-400' : 'text-red-400'} mb-1`}>
                                {formatPercent(results?.netMarginPercent || 0)}
                            </div>
                            <div className="text-sm text-zinc-400">
                                {formatCOP(results?.netMarginValue || 0)} / unidad
                            </div>
                        </div>

                        {/* Break Even */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Target size={16} className="text-zinc-400" />
                                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Punto Equilibrio</span>
                            </div>
                            <div className="text-4xl font-black text-white mb-1">
                                {results?.breakEvenUnits || 0}
                            </div>
                            <div className="text-sm text-zinc-400">
                                unidades para cubrir inversión
                            </div>
                        </div>

                        {/* Total Profit */}
                        <div className={`bg-gradient-to-br ${results?.totalProfit > 0 ? 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20' : 'from-red-500/10 to-red-500/5 border-red-500/20'} border rounded-2xl p-6`}>
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign size={16} className={results?.totalProfit > 0 ? 'text-emerald-400' : 'text-red-400'} />
                                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Ganancia Total</span>
                            </div>
                            <div className={`text-3xl font-black ${results?.totalProfit > 0 ? 'text-emerald-400' : 'text-red-400'} mb-1`}>
                                {formatCOP(results?.totalProfit || 0)}
                            </div>
                            <div className="text-sm text-zinc-400">
                                de {quantity} unidades
                            </div>
                        </div>

                        {/* ROI */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Percent size={16} className="text-zinc-400" />
                                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">ROI</span>
                            </div>
                            <div className="text-3xl font-black text-white mb-1">
                                {formatPercent(results?.roi || 0)}
                            </div>
                            <div className="text-sm text-zinc-400">
                                retorno de inversión
                            </div>
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Desglose del PVP</h3>

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
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.3)" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value) => [formatCOP(value), '']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex-1 space-y-2">
                                {(results?.breakdown || []).map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-sm text-zinc-400">{item.name}</span>
                                        </div>
                                        <span className="font-medium text-white">{formatCOP(item.value)}</span>
                                    </div>
                                ))}

                                <div className="pt-3 mt-2 border-t border-zinc-700 flex items-center justify-between">
                                    <span className="text-sm font-medium text-zinc-300">PVP Efectivo</span>
                                    <span className="text-lg font-bold text-white">{formatCOP(results?.effectivePvp || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Inversión Total</p>
                            <p className="text-xl font-bold text-white">{formatCOP(results?.totalProductionCost || 0)}</p>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Costo x Unidad</p>
                            <p className="text-xl font-bold text-white">{formatCOP(results?.unitCostReal || 0)}</p>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Margen Bruto</p>
                            <p className="text-xl font-bold text-white">{formatPercent(results?.grossMarginPercent || 0)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulatorPage;
