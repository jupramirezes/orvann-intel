import React, { useState, useEffect } from 'react';
import {
    Trash2,
    FileText,
    Calendar,
    Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { getQuotes, deleteQuote, formatCOP, formatPercent } from '../utils/storage';

const QuotesPage = ({ onNavigate }) => {
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        setQuotes(getQuotes());
    }, []);

    const handleDelete = (id) => {
        if (confirm('¿Eliminar esta cotización?')) {
            const filtered = deleteQuote(id);
            setQuotes(filtered);
        }
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('ORVANN Intel', 20, 25);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text('Resumen de Cotizaciones', 20, 35);
        doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, 20, 42);

        // Line separator
        doc.setDrawColor(200);
        doc.line(20, 48, pageWidth - 20, 48);

        // Quotes
        let yPos = 60;
        let totalProfit = 0;

        quotes.forEach((quote, index) => {
            if (yPos > 260) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0);
            doc.text(`${index + 1}. ${quote.productName}`, 20, yPos);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100);
            doc.text(formatDate(quote.createdAt), pageWidth - 20, yPos, { align: 'right' });

            yPos += 8;

            doc.setTextColor(60);
            doc.text(`Cantidad: ${quote.quantity} unidades`, 25, yPos);
            doc.text(`PVP: ${formatCOP(quote.pvp)}`, 90, yPos);

            yPos += 6;
            doc.text(`Margen Neto: ${formatPercent(quote.netMarginPercent)}`, 25, yPos);
            doc.text(`Punto Equilibrio: ${quote.breakEvenUnits} und`, 90, yPos);

            yPos += 6;
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(34, 197, 94); // green
            doc.text(`Ganancia Total: ${formatCOP(quote.totalProfit)}`, 25, yPos);

            totalProfit += quote.totalProfit;

            yPos += 15;
        });

        // Summary
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setDrawColor(200);
        doc.line(20, yPos, pageWidth - 20, yPos);

        yPos += 12;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text('RESUMEN TOTAL', 20, yPos);

        yPos += 10;
        doc.setFontSize(12);
        doc.text(`Total Cotizaciones: ${quotes.length}`, 20, yPos);

        yPos += 8;
        doc.setTextColor(34, 197, 94);
        doc.text(`Ganancia Proyectada Total: ${formatCOP(totalProfit)}`, 20, yPos);

        // Save
        doc.save(`orvann_cotizaciones_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-stone-50 mb-2 font-serif">Cotizaciones Guardadas</h1>
                    <p className="text-stone-400">Historial de simulaciones y proyecciones</p>
                </div>
                {quotes.length > 0 && (
                    <button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 px-5 py-3 bg-stone-100 text-stone-900 rounded-xl font-medium hover:bg-stone-200 transition-colors shadow-lg shadow-black/20"
                    >
                        <Download size={18} />
                        Exportar PDF
                    </button>
                )}
            </div>

            {quotes.length === 0 ? (
                <div className="rounded-2xl bg-stone-800/30 border border-stone-800 p-12 text-center">
                    <FileText size={48} className="mx-auto text-stone-600 mb-4" />
                    <h2 className="text-xl font-bold text-stone-50 mb-2 font-serif">Sin cotizaciones</h2>
                    <p className="text-stone-500 mb-6">Aún no has guardado ninguna simulación</p>
                    <button
                        onClick={() => onNavigate('simulator')}
                        className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-500 transition-colors shadow-lg shadow-amber-900/20"
                    >
                        Crear primera simulación
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quotes.map((quote) => (
                        <div
                            key={quote.id}
                            className="rounded-2xl bg-stone-800/30 border border-stone-800 p-6 hover:border-amber-600/30 transition-all group hover:bg-stone-800/50 shadow-lg shadow-black/10"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-stone-50 text-lg font-serif">{quote.productName}</h3>
                                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                                        <Calendar size={12} />
                                        {formatDate(quote.createdAt)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(quote.id)}
                                    className="p-2 text-stone-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">Cantidad</span>
                                    <span className="text-stone-200 font-medium">{quote.quantity} unidades</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">PVP</span>
                                    <span className="text-stone-200 font-medium">{formatCOP(quote.pvp)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">Punto Equilibrio</span>
                                    <span className="text-stone-200 font-medium">{quote.breakEvenUnits} unidades</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-stone-800 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-500 text-sm">Margen Neto</span>
                                    <span className={`font-bold ${quote.netMarginPercent > 30 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {formatPercent(quote.netMarginPercent)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-500 text-sm">Ganancia Total</span>
                                    <span className={`text-lg font-bold ${quote.totalProfit > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {formatCOP(quote.totalProfit)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuotesPage;
