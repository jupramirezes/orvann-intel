import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Edit3,
    Save,
    X
} from 'lucide-react';
import { getProducts, saveProducts, addProduct, deleteProduct, formatCOP, getCategories } from '../utils/storage';
import { calculateFinancials } from '../utils/calculator';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
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
        setCategories(getCategories());
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

    const handleCategoryChange = (e) => {
        const catName = e.target.value;
        const category = categories.find(c => c.name === catName);

        if (category) {
            setNewProduct({
                ...newProduct,
                category: catName,
                fabricCost: category.fabricCost,
                confectionCost: category.confectionCost,
                defaultPrintCost: category.printCost || 0,
                packagingCost: category.packagingCost,
                defaultPvp: category.suggestedPvp
            });
        } else {
            setNewProduct({ ...newProduct, category: catName });
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
                    <h1 className="text-3xl font-bold text-stone-50 mb-2 font-serif">Catálogo de Productos</h1>
                    <p className="text-stone-400">Gestiona tus productos y asigna plantillas de costos</p>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-xs text-stone-500 block mb-1">Nombre</label>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-xs text-stone-500 block mb-1">Categoría (Plantilla)</label>
                            <select
                                value={newProduct.category}
                                onChange={handleCategoryChange}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600 appearance-none cursor-pointer"
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                                <option value="Otro">Otro (Manual)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">Costo Tela</label>
                            <input
                                type="number"
                                placeholder="Costo Tela"
                                value={newProduct.fabricCost || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, fabricCost: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">Costo Confección</label>
                            <input
                                type="number"
                                placeholder="Confección"
                                value={newProduct.confectionCost || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, confectionCost: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">Estampado</label>
                            <input
                                type="number"
                                placeholder="Estampado"
                                value={newProduct.defaultPrintCost || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, defaultPrintCost: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">Empaque</label>
                            <input
                                type="number"
                                placeholder="Empaque"
                                value={newProduct.packagingCost || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, packagingCost: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">PVP Sugerido</label>
                            <input
                                type="number"
                                placeholder="PVP"
                                value={newProduct.defaultPvp || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, defaultPvp: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddProduct} className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-500 transition-colors shadow-lg shadow-amber-900/20">
                            <Save size={16} className="inline mr-2" />
                            Guardar
                        </button>
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-stone-700 text-stone-300 rounded-lg hover:bg-stone-600 transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden shadow-xl shadow-black/20">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-stone-800 bg-stone-800/40">
                            <th className="text-left px-6 py-4 text-xs font-medium text-stone-500 uppercase tracking-wider font-serif">Producto</th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-stone-500 uppercase tracking-wider font-serif">Tela</th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-stone-500 uppercase tracking-wider font-serif">Confección</th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-stone-500 uppercase tracking-wider font-serif">Estampado</th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-stone-500 uppercase tracking-wider font-serif">PVP</th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-stone-500 uppercase tracking-wider font-serif">Margen</th>
                            <th className="text-center px-6 py-4 text-xs font-medium text-stone-500 uppercase tracking-wider font-serif">Acciones</th>
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
                                <tr key={product.id} className="border-b border-stone-800 hover:bg-stone-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <div className="space-y-1">
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full px-2 py-1 bg-stone-950 border border-stone-700 rounded text-stone-50 text-sm focus:outline-none focus:border-amber-600"
                                                />
                                                <select
                                                    value={editForm.category}
                                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                    className="w-full px-2 py-1 bg-stone-950 border border-stone-700 rounded text-stone-400 text-xs focus:outline-none focus:border-amber-600"
                                                >
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                    ))}
                                                    <option value={editForm.category}>{editForm.category}</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-medium text-stone-50 font-serif">{product.name}</p>
                                                <p className="text-xs text-stone-500 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600/50"></span>
                                                    {product.category}
                                                </p>
                                            </div>
                                        )}
                                    </td>
                                    {['fabricCost', 'confectionCost', 'defaultPrintCost', 'defaultPvp'].map((field) => (
                                        <td key={field} className="px-6 py-4 text-right">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editForm[field]}
                                                    onChange={(e) => setEditForm({ ...editForm, [field]: Number(e.target.value) })}
                                                    className="w-24 px-2 py-1 bg-stone-950 border border-stone-700 rounded text-stone-50 text-sm text-right focus:outline-none focus:border-amber-600"
                                                />
                                            ) : (
                                                <span className="text-stone-300 font-mono text-sm">{formatCOP(data[field])}</span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right">
                                        <span className={`font-bold font-mono text-sm ${result.netMarginPercent > 30 ? 'text-emerald-500' : result.netMarginPercent > 15 ? 'text-amber-500' : 'text-red-500'}`}>
                                            {result.netMarginPercent.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {isEditing ? (
                                                <>
                                                    <button onClick={handleSaveEdit} className="p-2 text-amber-600 hover:bg-amber-600/10 rounded-lg transition-colors">
                                                        <Save size={16} />
                                                    </button>
                                                    <button onClick={handleCancelEdit} className="p-2 text-stone-500 hover:bg-stone-800 rounded-lg transition-colors">
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleEdit(product)} className="p-2 text-stone-500 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id)} className="p-2 text-stone-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
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
