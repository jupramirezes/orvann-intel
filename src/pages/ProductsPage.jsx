import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Edit3,
    Save,
    X
} from 'lucide-react';
import { getProducts, saveProducts, addProduct, deleteProduct, formatCOP } from '../utils/storage';
import { calculateFinancials } from '../utils/calculator';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);

    const [newProduct, setNewProduct] = useState({
        name: '',
        costs: [
            { id: 1, name: 'Tela', value: 0 },
            { id: 2, name: 'Confección', value: 0 },
            { id: 3, name: 'Estampado', value: 0 },
            { id: 4, name: 'Empaque', value: 2500 }
        ],
        defaultPvp: 0,
    });

    useEffect(() => {
        setProducts(getProducts());
    }, []);

    const handleEdit = (product) => {
        setEditingId(product.id);
        // Ensure legacy products have costs array structure
        const safeProduct = { ...product };
        if (!safeProduct.costs) {
            safeProduct.costs = [
                { id: '1-mig', name: 'Tela', value: safeProduct.fabricCost || 0 },
                { id: '2-mig', name: 'Confección', value: safeProduct.confectionCost || 0 },
                { id: '3-mig', name: 'Estampado', value: safeProduct.defaultPrintCost || 0 },
                { id: '4-mig', name: 'Empaque', value: safeProduct.packagingCost || 0 }
            ];
        }
        setEditForm(safeProduct);
    };

    const handleSaveEdit = () => {
        const updated = products.map(p => p.id === editingId ? editForm : p);
        saveProducts(updated);
        setProducts(updated);
        setEditingId(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar este producto?')) {
            const filtered = deleteProduct(id);
            setProducts(filtered);
        }
    };

    const handleAddProduct = () => {
        if (!newProduct.name) return;
        const created = addProduct(newProduct);
        setProducts([...products, created]);
        setShowAddForm(false);
        setNewProduct({
            name: '',
            costs: [
                { id: 1, name: 'Tela', value: 0 },
                { id: 2, name: 'Confección', value: 0 },
                { id: 3, name: 'Estampado', value: 0 },
                { id: 4, name: 'Empaque', value: 2500 }
            ],
            defaultPvp: 0,
        });
    };

    // Dynamic Cost Handlers
    const updateNewCost = (index, field, value) => {
        const updatedCosts = [...newProduct.costs];
        updatedCosts[index] = { ...updatedCosts[index], [field]: value };
        setNewProduct({ ...newProduct, costs: updatedCosts });
    };

    const addNewCostRow = () => {
        setNewProduct({
            ...newProduct,
            costs: [...newProduct.costs, { id: Date.now(), name: '', value: 0 }]
        });
    };

    const removeNewCostRow = (index) => {
        const updatedCosts = newProduct.costs.filter((_, i) => i !== index);
        setNewProduct({ ...newProduct, costs: updatedCosts });
    };

    // Edit Form Handlers
    const updateEditCost = (index, field, value) => {
        const updatedCosts = [...editForm.costs];
        updatedCosts[index] = { ...updatedCosts[index], [field]: value };
        setEditForm({ ...editForm, costs: updatedCosts });
    };

    const addEditCostRow = () => {
        setEditForm({
            ...editForm,
            costs: [...editForm.costs, { id: Date.now(), name: '', value: 0 }]
        });
    };

    const removeEditCostRow = (index) => {
        const updatedCosts = editForm.costs.filter((_, i) => i !== index);
        setEditForm({ ...editForm, costs: updatedCosts });
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-stone-50 mb-2 font-serif">Catálogo Dinámico</h1>
                    <p className="text-stone-400">Define la estructura de costos única para cada producto</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-stone-100 text-stone-900 rounded-xl font-medium hover:bg-stone-200 transition-colors"
                >
                    <Plus size={18} />
                    Agregar Producto
                </button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
                <div className="rounded-2xl bg-stone-800/50 border border-stone-700/50 p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-stone-50 mb-4 font-serif">Nuevo Producto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">Nombre del Producto</label>
                            <input
                                type="text"
                                placeholder="Ej: Hoodie Oversize"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-stone-50 focus:outline-none focus:border-amber-600 mb-4"
                            />

                            <label className="text-xs text-stone-500 block mb-1">Precio de Venta (PVP)</label>
                            <input
                                type="number"
                                placeholder="$ 0"
                                value={newProduct.defaultPvp || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, defaultPvp: Number(e.target.value) })}
                                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-stone-50 focus:outline-none focus:border-amber-600 font-bold text-emerald-400"
                            />
                        </div>

                        <div className="bg-stone-900/50 rounded-xl p-4 border border-stone-800">
                            <h4 className="text-sm font-bold text-stone-400 mb-3 uppercase tracking-wider">Estructura de Costos</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {newProduct.costs.map((cost, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder="Concepto"
                                            value={cost.name}
                                            onChange={(e) => updateNewCost(index, 'name', e.target.value)}
                                            className="flex-1 px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-stone-300 text-sm focus:border-amber-600 outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Valor"
                                            value={cost.value}
                                            onChange={(e) => updateNewCost(index, 'value', Number(e.target.value))}
                                            className="w-24 px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-stone-300 text-sm text-right focus:border-amber-600 outline-none"
                                        />
                                        <button
                                            onClick={() => removeNewCostRow(index)}
                                            className="p-2 text-stone-600 hover:text-red-400 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addNewCostRow}
                                className="mt-3 w-full py-2 border border-dashed border-stone-700 text-stone-500 rounded-lg hover:border-amber-600 hover:text-amber-600 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                                <Plus size={14} /> Agregar Costo
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-4 border-t border-stone-700/50">
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-stone-700 text-stone-300 rounded-lg hover:bg-stone-600 transition-colors">
                            Cancelar
                        </button>
                        <button onClick={handleAddProduct} className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-500 transition-colors shadow-lg shadow-amber-900/20">
                            <Save size={16} className="inline mr-2" />
                            Guardar Producto
                        </button>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 gap-4">
                {products.map((product) => {
                    const isEditing = editingId === product.id;
                    const data = isEditing ? editForm : product;

                    // Safe access to costs for calculation
                    const costs = data.costs || [];
                    const result = calculateFinancials({
                        quantity: 1,
                        costs: costs,
                        pvp: data.defaultPvp,
                    });

                    if (isEditing) {
                        return (
                            <div key={product.id} className="rounded-2xl bg-stone-800 border border-amber-600/30 p-6 shadow-xl relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs text-stone-500 block mb-1">Nombre</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:border-amber-600 outline-none mb-4"
                                        />
                                        <label className="text-xs text-stone-500 block mb-1">PVP</label>
                                        <input
                                            type="number"
                                            value={editForm.defaultPvp}
                                            onChange={(e) => setEditForm({ ...editForm, defaultPvp: Number(e.target.value) })}
                                            className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-emerald-400 font-bold focus:border-amber-600 outline-none"
                                        />
                                    </div>
                                    <div className="bg-stone-900/50 rounded-xl p-4 border border-stone-700">
                                        <h4 className="text-sm font-bold text-stone-400 mb-3 uppercase tracking-wider">Costos</h4>
                                        <div className="space-y-2">
                                            {editForm.costs?.map((cost, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={cost.name}
                                                        onChange={(e) => updateEditCost(index, 'name', e.target.value)}
                                                        className="flex-1 px-2 py-1 bg-stone-800 border border-stone-700 rounded text-stone-300 text-sm"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={cost.value}
                                                        onChange={(e) => updateEditCost(index, 'value', Number(e.target.value))}
                                                        className="w-24 px-2 py-1 bg-stone-800 border border-stone-700 rounded text-stone-300 text-right text-sm"
                                                    />
                                                    <button onClick={() => removeEditCostRow(index)} className="text-stone-600 hover:text-red-400"><X size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={addEditCostRow} className="mt-2 text-xs text-amber-600 hover:text-amber-500 flex items-center gap-1">+ Agregar fila</button>
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end mt-4">
                                    <button onClick={handleSaveEdit} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500">Guardar</button>
                                    <button onClick={handleCancelEdit} className="px-4 py-2 bg-stone-700 text-stone-300 rounded-lg hover:bg-stone-600">Cancelar</button>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={product.id} className="rounded-xl bg-stone-800/50 border border-stone-700 hover:border-stone-600 p-4 flex items-center justify-between transition-colors">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-stone-50 font-serif">{product.name}</h3>
                                <div className="text-xs text-stone-500 mt-1 flex flex-wrap gap-2">
                                    {(data.costs || []).slice(0, 3).map((c, i) => (
                                        <span key={i} className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">{c.name}: {formatCOP(c.value)}</span>
                                    ))}
                                    {(data.costs || []).length > 3 && <span>+{data.costs.length - 3} más</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 px-4 border-l border-stone-700/50 mx-4">
                                <div className="text-right">
                                    <p className="text-xs text-stone-500 uppercase">Costo Total</p>
                                    <p className="font-mono text-stone-300">{formatCOP(result.unitProdCost)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-stone-500 uppercase">PVP</p>
                                    <p className="font-mono text-stone-50 font-bold">{formatCOP(data.defaultPvp)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-stone-500 uppercase">Margen</p>
                                    <p className={`font-mono font-bold ${result.netMarginPercent > 30 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {result.netMarginPercent.toFixed(1)}%
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={() => handleEdit(product)} className="p-2 text-stone-500 hover:text-stone-100 hover:bg-stone-700 rounded-lg">
                                    <Edit3 size={18} />
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="p-2 text-stone-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductsPage;
