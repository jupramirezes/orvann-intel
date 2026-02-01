// Storage utilities for ORVANN-Intel
const STORAGE_KEYS = {
    PRODUCTS: 'orvann_products',
    QUOTES: 'orvann_quotes',
    SETTINGS: 'orvann_settings',
    COSTS: 'orvann_fixed_costs',
    DEBTS: 'orvann_debts',
};

// --- Financial Data Helpers ---

export const getFixedCosts = () => {
    const data = localStorage.getItem(STORAGE_KEYS.COSTS);
    return data ? JSON.parse(data) : [
        { id: 1, name: 'Arriendo', value: 1200000 },
        { id: 2, name: 'Servicios', value: 200000 },
        { id: 3, name: 'Nómina Base', value: 0 },
        { id: 4, name: 'Marketing', value: 500000 },
    ];
};

export const saveFixedCosts = (costs) => {
    localStorage.setItem(STORAGE_KEYS.COSTS, JSON.stringify(costs));
    window.dispatchEvent(new Event('storage-update'));
};

export const getDebts = () => {
    const data = localStorage.getItem(STORAGE_KEYS.DEBTS);
    return data ? JSON.parse(data) : [];
};

export const saveDebts = (debts) => {
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
    window.dispatchEvent(new Event('storage-update'));
};


// Default products with Dynamic Cost Structure
export const defaultProducts = [
    {
        id: 1,
        name: "Oversize Hoodie",
        costs: [
            { id: 1, name: "Tela Heavyweight", value: 35000 },
            { id: 2, name: "Confección Premium", value: 15000 },
            { id: 3, name: "Estampado DTG", value: 8000 },
            { id: 4, name: "Empaque", value: 2500 }
        ],
        defaultPvp: 145000,
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        name: "Premium Tee",
        costs: [
            { id: 1, name: "Tela Algodón", value: 12000 },
            { id: 2, name: "Confección", value: 8000 },
            { id: 3, name: "Estampado", value: 5000 },
            { id: 4, name: "Empaque", value: 2500 }
        ],
        defaultPvp: 85000,
        createdAt: new Date().toISOString(),
    }
];

// Products CRUD
export const getProducts = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let products = saved ? JSON.parse(saved) : defaultProducts;

    // Migration: Check if old structure exists and convert
    products = products.map(p => {
        if (!p.costs && (p.fabricCost || p.confectionCost)) {
            // Convert legacy to new format
            return {
                ...p,
                costs: [
                    { id: '1-migrated', name: 'Tela', value: p.fabricCost || 0 },
                    { id: '2-migrated', name: 'Confección', value: p.confectionCost || 0 },
                    { id: '3-migrated', name: 'Estampado', value: p.defaultPrintCost || 0 },
                    { id: '4-migrated', name: 'Empaque', value: p.packagingCost || 0 }
                ]
            };
        }
        return p;
    });

    return products;
};

export const saveProducts = (products) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const addProduct = (product) => {
    const products = getProducts();
    const newProduct = {
        ...product,
        id: Date.now(),
        createdAt: new Date().toISOString(),
    };
    saveProducts([...products, newProduct]);
    return newProduct;
};

export const updateProduct = (id, updates) => {
    const products = getProducts();
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
    saveProducts(updated);
    return updated;
};

export const deleteProduct = (id) => {
    const products = getProducts();
    const filtered = products.filter(p => p.id !== id);
    saveProducts(filtered);
    return filtered;
};

// Quotes CRUD
export const getQuotes = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUOTES);
    return saved ? JSON.parse(saved) : [];
};

export const saveQuote = (quote) => {
    const quotes = getQuotes();
    const newQuote = {
        ...quote,
        id: Date.now(),
        createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify([...quotes, newQuote]));
    return newQuote;
};

export const deleteQuote = (id) => {
    const quotes = getQuotes();
    const filtered = quotes.filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(filtered));
    return filtered;
};

// Format helpers
export const formatCOP = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
};
