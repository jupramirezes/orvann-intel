// Enhanced calculator for ORVANN-Intel v3.1 (Dynamic Costs)

export const calculateFinancials = (params) => {
    const {
        quantity,
        costs = [], // Array of { name, value }
        pvp,
        extraShipping = 0,
        discount = 0,
    } = params;

    // Sum generic production costs from the dynamic array
    const unitProdCost = costs.reduce((sum, item) => sum + Number(item.value || 0), 0) +
        Number(params.packagingCost || 0) + // Backward compatibility or specific extra
        Number(params.fabricCost || 0) +
        Number(params.confectionCost || 0) +
        Number(params.printingCost || 0);

    // If costs array is used, we assume it covers everything. 
    // If legacy params are passed (mixed state), we sum them. 
    // The previous implementation used distinct params. New one uses 'costs' array.
    // We'll normalize: if 'costs' has items, use that. If not, use legacy.

    let finalUnitProdCost = 0;

    if (costs.length > 0) {
        finalUnitProdCost = costs.reduce((sum, item) => sum + Number(item.value || 0), 0);
    } else {
        // Fallback for transition
        finalUnitProdCost = Number(params.fabricCost || 0) + Number(params.confectionCost || 0) + Number(params.printingCost || 0) + Number(params.packagingCost || 0);
    }

    const totalProductionCost = finalUnitProdCost * quantity;

    // Effective PVP
    const effectivePvp = pvp * (1 - discount / 100);

    // Gateway Commission (Bold/Wompi: 3.2% + 900)
    const gatewayPerUnit = (effectivePvp * 0.032) + 900;

    // Retentions (ICA 0.7%, Renta 1.5%)
    const retentionsPerUnit = (effectivePvp * 0.007) + (effectivePvp * 0.015);

    // Total Variable Costs
    const totalVariableCosts = gatewayPerUnit + retentionsPerUnit + Number(extraShipping);

    // Gross Margin
    const grossMarginValue = effectivePvp - finalUnitProdCost;
    const grossMarginPercent = effectivePvp > 0 ? (grossMarginValue / effectivePvp) * 100 : 0;

    // Net Margin
    const netMarginValue = effectivePvp - finalUnitProdCost - totalVariableCosts;
    const netMarginPercent = effectivePvp > 0 ? (netMarginValue / effectivePvp) * 100 : 0;

    // Total Profit
    const totalProfit = netMarginValue * quantity;

    // Break Even
    const contributionMargin = effectivePvp - totalVariableCosts;
    let breakEvenUnits = 0;
    if (contributionMargin > 0) {
        breakEvenUnits = Math.ceil(totalProductionCost / contributionMargin);
    } else {
        breakEvenUnits = Infinity;
    }

    // ROI
    const roi = totalProductionCost > 0 ? (totalProfit / totalProductionCost) * 100 : 0;

    // Breakdown generation
    let breakdown = [];
    if (costs.length > 0) {
        breakdown = costs.map((c, i) => ({
            name: c.name,
            value: Number(c.value),
            color: hslToHex(0, 0, 30 + (i * 10)) // Grayscale variation
        }));
    } else {
        breakdown = [
            { name: 'Tela', value: Number(params.fabricCost), color: '#404040' },
            { name: 'Confección', value: Number(params.confectionCost), color: '#525252' },
            { name: 'Estampado', value: Number(params.printingCost), color: '#737373' },
            { name: 'Empaque', value: Number(params.packagingCost), color: '#a3a3a3' },
        ];
    }

    // Add variable costs to breakdown
    breakdown.push(
        { name: 'Pasarela', value: gatewayPerUnit, color: '#dc2626' },
        { name: 'Retenciones', value: retentionsPerUnit, color: '#ea580c' },
        { name: 'Envío/Extra', value: Number(extraShipping), color: '#eab308' },
        { name: 'Ganancia', value: Math.max(0, netMarginValue), color: '#22c55e' }
    );

    return {
        unitProdCost: finalUnitProdCost,
        totalProductionCost,
        unitCostReal: finalUnitProdCost + Number(extraShipping),
        gatewayCost: gatewayPerUnit,
        retentionsCost: retentionsPerUnit,
        totalVariableCosts,
        grossMarginValue,
        grossMarginPercent,
        netMarginValue,
        netMarginPercent,
        totalProfit,
        effectivePvp,
        breakEvenUnits: breakEvenUnits === Infinity ? 0 : breakEvenUnits,
        roi,
        breakdown: breakdown.filter(d => d.value > 0),
    };
};

// Helper for dynamic colors
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
