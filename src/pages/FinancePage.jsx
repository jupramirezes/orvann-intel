import React, { useState, useEffect, useMemo } from 'react';
import {
    DollarSign,
    TrendingUp,
    Plus,
    Trash2,
    Save,
    AlertCircle,
    PiggyBank,
    Wallet
} from 'lucide-react';
import {
    getFixedCosts,
    saveFixedCosts,
    getDebts,
    saveDebts,
    getProducts
} from '../utils/storage';

const FinancePage = () => {
    const [fixedCosts, setFixedCosts] = useState([]);
    const [debts, setDebts] = useState([]);
    const [products, setProducts] = useState([]);
    const [targetMargin, setTargetMargin] = useState(40); // Default global margin %

    // Load data
    useEffect(() => {
        setFixedCosts(getFixedCosts());
        setDebts(getDebts());
        setProducts(getProducts());
    }, []);

    // Persist data
    const handleSaveCosts = (newCosts) => {
        setFixedCosts(newCosts);
        saveFixedCosts(newCosts);
    };

    const handleSaveDebts = (newDebts) => {
        setDebts(newDebts);
        saveDebts(newDebts);
    };

    // Calculations
    const totalFixedCosts = useMemo(() =>
        fixedCosts.reduce((sum, item) => sum + (Number(item.value) || 0), 0),
        [fixedCosts]);

    const totalDebts = useMemo(() =>
        debts.reduce((sum, item) => sum + (Number(item.value) || 0), 0),
        [debts]);

    // Calculate Average Product Margin (Weighted would be better but simple avg for now)
    const avgProductMarginVal = useMemo(() => {
        if (products.length === 0) return 30000; // Fallback
        const totalMargin = products.reduce((sum, p) => {
            // Calculate individual product margin
            // Assuming 'price' is available or 'suggestedPrice'. 
            // Need to handle the dynamic structure.
            // Simple approximation: Price - Cost.
            // Use the first item's price from price range or a default.

            // Let's use the first cost calculation logic briefly here or just trust a simplistic avg
            // For accuracy, let's use the 'targetMargin' slider as the driver for "Global Break Even"
            // instead of trying to average 50 different products.
            return sum;
        }, 0);
        return 30000; // Placeholder if we rely on margin % slider
    }, [products]);

    // Break Even Calculation
    // Formula: Fixed Costs / (Avg Ticket * Margin %)
    // Avg Ticket assumption: $100,000 for simplicity or configurable
    const avgTicket = 120000;
    const marginPerUnit = avgTicket * (targetMargin / 100);
    const breakEvenUnits = marginPerUnit > 0 ? Math.ceil(totalFixedCosts / marginPerUnit) : 0;
    // Debt coverage: if we want to pay 10% of debt monthly
    const monthlyDebtPayment = totalDebts * 0.10;
    const breakEvenWithDebt = marginPerUnit > 0 ? Math.ceil((totalFixedCosts + monthlyDebtPayment) / marginPerUnit) : 0;

    // Formatters
    const formatCOP = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

    // Handlers
    const addCost = () => handleSaveCosts([...fixedCosts, { id: Date.now(), name: 'Nuevo Costo', value: 0 }]);
    const updateCost = (id, field, val) => {
        const newCosts = fixedCosts.map(c => c.id === id ? { ...c, [field]: val } : c);
        handleSaveCosts(newCosts);
    };
    const removeCost = (id) => handleSaveCosts(fixedCosts.filter(c => c.id !== id));

    const addDebt = () => handleSaveDebts([...debts, { id: Date.now(), name: 'Nueva Deuda', value: 0 }]);
    const updateDebt = (id, field, val) => {
        const newDebts = debts.map(d => d.id === id ? { ...d, [field]: val } : d);
        handleSaveDebts(newDebts);
    };
    const removeDebt = (id) => handleSaveDebts(debts.filter(d => d.id !== id));

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto text-stone-300">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-800 pb-6">
                <div>
                    <h1 className="text-4xl font-serif text-amber-500 mb-2">Finanzas Globales</h1>
                    <p className="text-stone-500 font-light">Control de costos fijos, deuda y punto de equilibrio.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-stone-900 border border-stone-800 rounded-lg p-4 text-center min-w-[150px]">
                        <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Costos Mensuales</p>
                        <p className="text-xl font-bold text-stone-200">{formatCOP(totalFixedCosts)}</p>
                    </div>
                    <div className="bg-stone-900 border border-stone-800 rounded-lg p-4 text-center min-w-[150px]">
                        <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Deuda Total</p>
                        <p className="text-xl font-bold text-red-400">{formatCOP(totalDebts)}</p>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Costos Fijos */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-stone-900/50 p-4 rounded-t-xl border-b border-stone-800">
                        <h2 className="text-xl font-serif text-stone-200 flex items-center gap-2">
                            <Wallet size={20} className="text-amber-600" /> Costos Fijos
                        </h2>
                        <button onClick={addCost} className="text-xs flex items-center gap-1 bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded transition-colors text-amber-500">
                            <Plus size={14} /> Agregar
                        </button>
                    </div>
                    <div className="bg-stone-900 border border-stone-800 rounded-b-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-stone-950 text-xs uppercase tracking-wider text-stone-500">
                                <tr>
                                    <th className="p-4 font-normal">Concepto</th>
                                    <th className="p-4 font-normal text-right">Valor Mensual</th>
                                    <th className="p-4 font-normal w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800">
                                {fixedCosts.map(item => (
                                    <tr key={item.id} className="hover:bg-stone-800/30 transition-colors">
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => updateCost(item.id, 'name', e.target.value)}
                                                className="bg-transparent border-none w-full text-stone-300 focus:ring-0 placeholder-stone-600"
                                                placeholder="Concepto..."
                                            />
                                        </td>
                                        <td className="p-3 text-right">
                                            <input
                                                type="number"
                                                value={item.value}
                                                onChange={(e) => updateCost(item.id, 'value', Number(e.target.value))}
                                                className="bg-transparent border-none w-full text-stone-200 text-right focus:ring-0"
                                            />
                                        </td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => removeCost(item.id)} className="text-stone-600 hover:text-red-400 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {fixedCosts.length === 0 && (
                                    <tr><td colSpan="3" className="p-8 text-center text-stone-600 italic">No hay costos registrados</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Deudas */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-stone-900/50 p-4 rounded-t-xl border-b border-stone-800">
                        <h2 className="text-xl font-serif text-stone-200 flex items-center gap-2">
                            <AlertCircle size={20} className="text-red-500" /> Deudas Activas
                        </h2>
                        <button onClick={addDebt} className="text-xs flex items-center gap-1 bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded transition-colors text-red-400">
                            <Plus size={14} /> Agregar
                        </button>
                    </div>
                    <div className="bg-stone-900 border border-stone-800 rounded-b-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-stone-950 text-xs uppercase tracking-wider text-stone-500">
                                <tr>
                                    <th className="p-4 font-normal">Acreedor</th>
                                    <th className="p-4 font-normal text-right">Saldo</th>
                                    <th className="p-4 font-normal w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800">
                                {debts.map(item => (
                                    <tr key={item.id} className="hover:bg-stone-800/30 transition-colors">
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => updateDebt(item.id, 'name', e.target.value)}
                                                className="bg-transparent border-none w-full text-stone-300 focus:ring-0 placeholder-stone-600"
                                                placeholder="Banco, Proveedor..."
                                            />
                                        </td>
                                        <td className="p-3 text-right">
                                            <input
                                                type="number"
                                                value={item.value}
                                                onChange={(e) => updateDebt(item.id, 'value', Number(e.target.value))}
                                                className="bg-transparent border-none w-full text-stone-200 text-right focus:ring-0"
                                            />
                                        </td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => removeDebt(item.id)} className="text-stone-600 hover:text-red-400 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {debts.length === 0 && (
                                    <tr><td colSpan="3" className="p-8 text-center text-stone-600 italic">No hay deudas registradas</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Break Even Global */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 rounded-xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="text-amber-500" size={28} />
                    <h2 className="text-2xl font-serif text-white">Objetivos de Supervivencia</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Controls */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase text-stone-500 tracking-wider mb-2">Simulación: Ticket Promedio</label>
                            <div className="text-2xl font-mono text-stone-300">{formatCOP(avgTicket)}</div>
                            <p className="text-xs text-stone-600 mt-1">Estimado para cálculos (Hoodie + Envío)</p>
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-stone-500 tracking-wider mb-4">Margen Global Objetivo</label>
                            <input
                                type="range"
                                min="20"
                                max="60"
                                value={targetMargin}
                                onChange={(e) => setTargetMargin(Number(e.target.value))}
                                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <div className="flex justify-between mt-2 font-mono text-sm">
                                <span className="text-stone-500">20%</span>
                                <span className="text-amber-500 font-bold text-lg">{targetMargin}%</span>
                                <span className="text-stone-500">60%</span>
                            </div>
                        </div>
                    </div>

                    {/* Metric 1 */}
                    <div className="bg-stone-950/50 rounded-lg p-6 border border-stone-800/50 flex flex-col justify-center items-center text-center">
                        <span className="text-stone-500 text-xs uppercase tracking-widest mb-2">Solo Costos Fijos</span>
                        <div className="text-5xl font-bold text-white mb-2">{breakEvenUnits}</div>
                        <span className="text-amber-600/80 text-sm">Prendas / mes</span>
                        <p className="text-stone-600 text-xs mt-4 px-4">Para cubrir {formatCOP(totalFixedCosts)} sin pagar deuda.</p>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-stone-950/50 rounded-lg p-6 border border-amber-900/20 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <PiggyBank size={80} />
                        </div>
                        <span className="text-stone-500 text-xs uppercase tracking-widest mb-2">Meta Real (+10% Deuda)</span>
                        <div className="text-5xl font-bold text-amber-500 mb-2">{breakEvenWithDebt}</div>
                        <span className="text-amber-600/80 text-sm">Prendas / mes</span>
                        <p className="text-stone-600 text-xs mt-4 px-4">Cubre fijos + {formatCOP(monthlyDebtPayment)} abono deuda.</p>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default FinancePage;
