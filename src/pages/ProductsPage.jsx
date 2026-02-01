import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Edit3,
    Save,
    X,
    Package
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
        category: '',
        fabricCost: 0,
        confectionCost: 0,
        defaultPrintCost: 0,
        packagingCost: 2500,
        defaultPvp: 0,
    });

    useEffect(() => {
        setProducts(getProducts());
    }, []);

    const handleEdit = (product) => {
        setEditingId(product.id);
        setEditForm({ ...product });
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
            category: '',
            fabricCost: 0,
            confectionCost: 0,
            defaultPrintCost: 0,
            packagingCost: 2500,
            defaultPvp: 0,
        });
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Catálogo de Productos</h1>
                    <p className="text-zinc-500">Gestiona tus productos y sus costos base</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-colors"
                >
                    <Plus size={18} />
                    Agregar Producto
                </button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Nuevo Producto</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                        />
                        <input
                            type="text"
                            placeholder="Categoría"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                        />
                        <input
                            type="number"
                            placeholder="Costo Tela"
                            value={newProduct.fabricCost || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, fabricCost: Number(e.target.value) })}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                        />
                        <input
                            type="number"
                            placeholder="Costo Confección"
                            value={newProduct.confectionCost || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, confectionCost: Number(e.target.value) })}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                        />
                        <input
                            type="number"
                            placeholder="Costo Estampado"
                            value={newProduct.defaultPrintCost || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, defaultPrintCost: Number(e.target.value) })}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                        />
                        <input
                            type="number"
                            placeholder="Empaque"
                            value={newProduct.packagingCost || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, packagingCost: Number(e.target.value) })}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                        />
                        <input
                            type="number"
                            placeholder="PVP Sugerido"
                            value={newProduct.defaultPvp || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, defaultPvp: Number(e.target.value) })}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddProduct} className="px-4 py-2 bg-emerald-500 text-black rounded-lg font-medium hover:bg-emerald-400 transition-colors">
                            <Save size={16} className="inline mr-2" />
                            Guardar
                        </button>
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Producto</th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Tela</th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Confección</th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Estampado</th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Empaque</th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">PVP</th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Margen</th>
                            <th className="text-center px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const isEditing = editingId === product.id;
                            const data = isEditing ? editForm : product;

                            const result = calculateFinancials({
                                quantity: 1,
                                fabricCost: data.fabricCost,
                                confectionCost: data.confectionCost,
                                printingCost: data.defaultPrintCost,
                                packagingCost: data.packagingCost,
                                pvp: data.defaultPvp,
                            });

                            return (
                                <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <div className="space-y-1">
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full px-2 py-1 bg-black/50 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-white/40"
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.category}
                                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                    className="w-full px-2 py-1 bg-black/50 border border-white/20 rounded text-zinc-400 text-xs focus:outline-none focus:border-white/40"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-medium text-white">{product.name}</p>
                                                <p className="text-xs text-zinc-500">{product.category}</p>
                                            </div>
                                        )}
                                    </td>
                                    {['fabricCost', 'confectionCost', 'defaultPrintCost', 'packagingCost', 'defaultPvp'].map((field) => (
                                        <td key={field} className="px-6 py-4 text-right">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editForm[field]}
                                                    onChange={(e) => setEditForm({ ...editForm, [field]: Number(e.target.value) })}
                                                    className="w-24 px-2 py-1 bg-black/50 border border-white/20 rounded text-white text-sm text-right focus:outline-none focus:border-white/40"
                                                />
                                            ) : (
                                                <span className="text-zinc-300">{formatCOP(data[field])}</span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right">
                                        <span className={`font-bold ${result.netMarginPercent > 30 ? 'text-emerald-400' : result.netMarginPercent > 15 ? 'text-amber-400' : 'text-red-400'}`}>
                                            {result.netMarginPercent.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {isEditing ? (
                                                <>
                                                    <button onClick={handleSaveEdit} className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors">
                                                        <Save size={16} />
                                                    </button>
                                                    <button onClick={handleCancelEdit} className="p-2 text-zinc-400 hover:bg-white/10 rounded-lg transition-colors">
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleEdit(product)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsPage;
