// Enhanced calculator for ORVANN-Intel v3

export const calculateFinancials = (params) => {
    const {
        quantity,
        fabricCost,
        confectionCost,
        printingCost,
        packagingCost = 2500,
        pvp,
        extraShipping = 0,
        discount = 0,
    } = params;

    // Costo unitario base de producción
    const unitProdCost = Number(fabricCost) + Number(confectionCost) + Number(printingCost) + Number(packagingCost);
    const totalProductionCost = unitProdCost * quantity;

    // PVP efectivo después de descuento
    const effectivePvp = pvp * (1 - discount / 100);

    // Comisión pasarela (Bold/Wompi: 3.2% + 900)
    const gatewayPerUnit = (effectivePvp * 0.032) + 900;

    // Retenciones (ICA 0.7%, Renta 1.5%)
    const retentionsPerUnit = (effectivePvp * 0.007) + (effectivePvp * 0.015);

    // Total de costos variables por unidad
    const totalVariableCosts = gatewayPerUnit + retentionsPerUnit + Number(extraShipping);

    // Margen Bruto (PVP efectivo - Costo Producción)
    const grossMarginValue = effectivePvp - unitProdCost;
    const grossMarginPercent = effectivePvp > 0 ? (grossMarginValue / effectivePvp) * 100 : 0;

    // Margen Neto (PVP efectivo - Costo Producción - Costos Variables)
    const netMarginValue = effectivePvp - unitProdCost - totalVariableCosts;
    const netMarginPercent = effectivePvp > 0 ? (netMarginValue / effectivePvp) * 100 : 0;

    // Ganancia total del lote
    const totalProfit = netMarginValue * quantity;

    // Margen de Contribución para Punto de Equilibrio
    const contributionMargin = effectivePvp - totalVariableCosts;

    let breakEvenUnits = 0;
    if (contributionMargin > 0) {
        breakEvenUnits = Math.ceil(totalProductionCost / contributionMargin);
    } else {
        breakEvenUnits = Infinity;
    }

    // ROI (Return on Investment)
    const roi = totalProductionCost > 0 ? (totalProfit / totalProductionCost) * 100 : 0;

    return {
        // Costos
        unitProdCost,
        totalProductionCost,
        unitCostReal: unitProdCost + Number(extraShipping),

        // Pasarela y retenciones
        gatewayCost: gatewayPerUnit,
        retentionsCost: retentionsPerUnit,
        totalVariableCosts,

        // Márgenes
        grossMarginValue,
        grossMarginPercent,
        netMarginValue,
        netMarginPercent,

        // Totales
        totalProfit,
        effectivePvp,
        breakEvenUnits: breakEvenUnits === Infinity ? 0 : breakEvenUnits,
        roi,

        // Para gráficos de desglose
        breakdown: [
            { name: 'Tela', value: Number(fabricCost), color: '#404040' },
            { name: 'Confección', value: Number(confectionCost), color: '#525252' },
            { name: 'Estampado', value: Number(printingCost), color: '#737373' },
            { name: 'Empaque', value: Number(packagingCost), color: '#a3a3a3' },
            { name: 'Pasarela', value: gatewayPerUnit, color: '#dc2626' },
            { name: 'Retenciones', value: retentionsPerUnit, color: '#ea580c' },
            { name: 'Envío/Extra', value: Number(extraShipping), color: '#eab308' },
            { name: 'Ganancia', value: Math.max(0, netMarginValue), color: '#22c55e' },
        ].filter(d => d.value > 0),
    };
};
