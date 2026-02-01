// Storage utilities for ORVANN-Intel
const STORAGE_KEYS = {
    PRODUCTS: 'orvann_products',
    QUOTES: 'orvann_quotes',
    SETTINGS: 'orvann_settings',
};

// Default products with full cost structure
export const defaultProducts = [
    {
        id: 1,
        name: "Oversize Hoodie",
        category: "Hoodies",
        fabricCost: 35000,
        confectionCost: 15000,
        defaultPrintCost: 8000,
        packagingCost: 2500,
        defaultPvp: 145000,
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        name: "Premium Tee",
        category: "Camisetas",
        fabricCost: 12000,
        confectionCost: 8000,
        defaultPrintCost: 5000,
        packagingCost: 2500,
        defaultPvp: 85000,
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        name: "Cargo Pants",
        category: "Pants",
        fabricCost: 28000,
        confectionCost: 18000,
        defaultPrintCost: 0,
        packagingCost: 2500,
        defaultPvp: 135000,
        createdAt: new Date().toISOString(),
    },
];

// Products CRUD
export const getProducts = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : defaultProducts;
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
