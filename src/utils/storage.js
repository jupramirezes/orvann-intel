// Storage utilities for ORVANN-Intel
const STORAGE_KEYS = {
    PRODUCTS: 'orvann_products',
    CATEGORIES: 'orvann_categories',
    QUOTES: 'orvann_quotes',
    SETTINGS: 'orvann_settings',
};

export const defaultCategories = [
    {
        id: 1,
        name: "Hoodie Heavyweight",
        fabricCost: 35000,
        confectionCost: 15000,
        printCost: 8000,
        packagingCost: 2500,
        suggestedPvp: 145000,
    },
    {
        id: 2,
        name: "Camiseta Premium",
        fabricCost: 12000,
        confectionCost: 8000,
        printCost: 5000,
        packagingCost: 2500,
        suggestedPvp: 85000,
    },
    {
        id: 3,
        name: "Cargo Pants",
        fabricCost: 28000,
        confectionCost: 18000,
        printCost: 0,
        packagingCost: 2500,
        suggestedPvp: 135000,
    },
];

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

// Categories CRUD (Templates)
export const getCategories = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : defaultCategories;
};

export const saveCategories = (categories) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const addCategory = (category) => {
    const categories = getCategories();
    const newCat = {
        ...category,
        id: Date.now(),
    };
    saveCategories([...categories, newCat]);
    return newCat;
};

export const updateCategory = (id, updates) => {
    const categories = getCategories();
    const updated = categories.map(c => c.id === id ? { ...c, ...updates } : c);
    saveCategories(updated);
    return updated;
};

export const deleteCategory = (id) => {
    const categories = getCategories();
    const filtered = categories.filter(c => c.id !== id);
    saveCategories(filtered);
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
