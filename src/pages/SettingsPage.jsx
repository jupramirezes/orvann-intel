import React, { useRef } from 'react';
import {
    Download,
    Upload,
    FileSpreadsheet,
    ShieldCheck,
    AlertTriangle,
    Database
} from 'lucide-react';
import { exportData, importData, STORAGE_KEYS } from '../utils/storage';
import * as XLSX from 'xlsx';

const SettingsPage = () => {
    const fileInputRef = useRef(null);

    const handleJsonExport = () => {
        exportData();
    };

    const handleExcelExport = () => {
        const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
        const quotes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUOTES) || '[]');
        const fixedCosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.COSTS) || '[]');
        const debts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEBTS) || '[]');
        const ideas = JSON.parse(localStorage.getItem(STORAGE_KEYS.IDEAS) || '[]');

        const productsData = products.map(p => {
            const totalCost = (p.costs || []).reduce((sum, c) => sum + (c.value || 0), 0);
            const margin = p.defaultPvp - totalCost;
            const marginPercent = p.defaultPvp > 0 ? (margin / p.defaultPvp) : 0;

            return {
                ID: p.id,
                Nombre: p.name,
                'Costo Total': totalCost,
                'Precio Venta (PVP)': p.defaultPvp,
                'Margen ($)': margin,
                'Margen (%)': `${(marginPercent * 100).toFixed(1)}%`,
                'Categoría': p.category || 'N/A',
                'Fecha Creación': new Date(p.createdAt).toLocaleDateString(),
            };
        });

        const quotesData = quotes.map(q => ({
            Fecha: new Date(q.createdAt).toLocaleDateString(),
            Producto: q.productName,
            Cantidad: q.quantity,
            'PVP Unitario': q.pvp,
            'Costo Producción Total': q.totalProductionCost,
            'Ganancia Neta Lote': q.totalProfit,
            'ROI': `${(q.roi * 100).toFixed(1)}%`,
            'Punto Equilibrio (Unids)': q.breakEvenUnits
        }));

        const financeData = fixedCosts.map(c => ({ Tipo: 'Costo Fijo', Concepto: c.name, Valor: c.value }));
        debts.forEach(d => financeData.push({ Tipo: 'Deuda', Concepto: d.name, Valor: d.value }));

        const wb = XLSX.utils.book_new();

        if (productsData.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productsData), "Productos");
        if (quotesData.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(quotesData), "Cotizaciones");
        if (financeData.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(financeData), "Finanzas");

        if (ideas.length > 0) {
            const ideasData = ideas.map(i => ({
                Titulo: i.title, Query: i.query, Quote: i.quote, Description: i.description
            }));
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ideasData), "Ideas Studio");
        }

        XLSX.writeFile(wb, `ORVANN_Reporte_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!confirm('ADVERTENCIA: Restaurar un backup SOBREESCRIBIRÁ todos tus datos actuales. ¿Estás seguro?')) {
            e.target.value = '';
            return;
        }

        try {
            await importData(file);
            alert('¡Restauración completa! La página se recargará.');
            window.location.reload();
        } catch (error) {
            alert('Error al restaurar: ' + error.message);
        }
        e.target.value = '';
    };

    return (
        <div className="p-8 pb-32 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-serif text-stone-50 mb-2 flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500" /> Seguridad y Datos
                </h1>
                <p className="text-stone-500">Gestiona copias de seguridad y exporta reportes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-stone-800 rounded-full text-stone-300"><Download size={32} /></div>
                        <div><h2 className="text-xl font-bold text-stone-200 font-serif">Exportar Datos</h2><p className="text-sm text-stone-500">Guarda info fuera del navegador.</p></div>
                    </div>
                    <div className="space-y-4">
                        <button onClick={handleJsonExport} className="w-full flex items-center justify-between bg-stone-950 border border-stone-800 p-4 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all">
                            <div className="flex items-center gap-3"><Database size={20} className="text-emerald-500" /><div className="text-left"><span className="block font-bold text-stone-200">Copia de Seguridad (.json)</span><span className="text-xs text-stone-500">Para restaurar el sistema después.</span></div></div>
                        </button>
                        <button onClick={handleExcelExport} className="w-full flex items-center justify-between bg-stone-950 border border-stone-800 p-4 rounded-xl hover:border-green-500/50 hover:bg-green-900/10 transition-all">
                            <div className="flex items-center gap-3"><FileSpreadsheet size={20} className="text-green-500" /><div className="text-left"><span className="block font-bold text-stone-200">Reporte Excel (.xlsx)</span><span className="text-xs text-stone-500">Formato estándar para contabilidad.</span></div></div>
                        </button>
                    </div>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="p-4 bg-stone-800 rounded-full text-stone-300"><Upload size={32} /></div>
                        <div><h2 className="text-xl font-bold text-stone-200 font-serif">Restaurar Datos</h2><p className="text-sm text-stone-500">Recupera un backup previo.</p></div>
                    </div>
                    <div className="bg-amber-900/10 border border-amber-900/30 p-4 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs text-amber-500/80 leading-relaxed">Al restaurar, se borrarán todos los datos actuales y se reemplazarán por los del respaldo.</p>
                    </div>
                    <button onClick={handleImportClick} className="w-full bg-stone-100 hover:bg-white text-stone-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors relative z-10">
                        <Upload size={18} /> Seleccionar Archivo .json
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                </div>
            </div>
        </div>
    );
};
export default SettingsPage;
