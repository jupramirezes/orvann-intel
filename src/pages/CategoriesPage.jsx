import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Edit3,
    Save,
    X,
    Tags
} from 'lucide-react';
import { getCategories, saveCategories, addCategory, updateCategory, deleteCategory, formatCOP } from '../utils/storage';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        fabricCost: 0,
        confectionCost: 0,
        printCost: 0,
        packagingCost: 2500,
        suggestedPvp: 0,
    });

    useEffect(() => {
        setCategories(getCategories());
    }, []);

    const handleEdit = (category) => {
        setEditingId(category.id);
        setEditForm({ ...category });
    };

    const handleSaveEdit = () => {
        updateCategory(editingId, editForm);
        setCategories(getCategories());
        setEditingId(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar esta categoría?')) {
            const filtered = deleteCategory(id);
            setCategories(filtered);
        }
    };

    const handleAddCategory = () => {
        if (!newCategory.name) return;
        addCategory(newCategory);
        setCategories(getCategories());
        setShowAddForm(false);
        setNewCategory({
            name: '',
            fabricCost: 0,
            confectionCost: 0,
            printCost: 0,
            packagingCost: 2500,
            suggestedPvp: 0,
        });
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-stone-50 mb-2 font-serif">Gestión de Categorías</h1>
                    <p className="text-stone-400">Define plantillas de costos para tus productos</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-stone-100 text-stone-900 rounded-xl font-medium hover:bg-stone-200 transition-colors"
                >
                    <Plus size={18} />
                    Nueva Categoría
                </button>
            </div>

            {/* Add Category Form */}
            {showAddForm && (
                <div className="rounded-2xl bg-stone-800/50 border border-stone-700/50 p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-stone-50 mb-4 font-serif">Nueva Plantilla</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                        <div className="md:col-span-2 lg:col-span-1">
                            <label className="text-xs text-stone-500 block mb-1">Nombre</label>
                            <input
                                type="text"
                                placeholder="Ej: Hoodie"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">Costo Tela</label>
                            <input
                                type="number"
                                value={newCategory.fabricCost || ''}
                                onChange={(e) => setNewCategory({ ...newCategory, fabricCost: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">Confección</label>
                            <input
                                type="number"
                                value={newCategory.confectionCost || ''}
                                onChange={(e) => setNewCategory({ ...newCategory, confectionCost: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">Estampado</label>
                            <input
                                type="number"
                                value={newCategory.printCost || ''}
                                onChange={(e) => setNewCategory({ ...newCategory, printCost: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">Empaque</label>
                            <input
                                type="number"
                                value={newCategory.packagingCost || ''}
                                onChange={(e) => setNewCategory({ ...newCategory, packagingCost: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 block mb-1">PVP Sugerido</label>
                            <input
                                type="number"
                                value={newCategory.suggestedPvp || ''}
                                onChange={(e) => setNewCategory({ ...newCategory, suggestedPvp: Number(e.target.value) })}
                                className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-50 focus:outline-none focus:border-amber-600"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddCategory} className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-500 transition-colors shadow-lg shadow-amber-900/20">
                            <Save size={16} className="inline mr-2" />
                            Guardar Plantilla
                        </button>
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-stone-700 text-stone-300 rounded-lg hover:bg-stone-600 transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                    const isEditing = editingId === category.id;
                    const data = isEditing ? editForm : category;

                    return (
                        <div key={category.id} className="group relative rounded-2xl bg-stone-800 border border-stone-700 hover:border-amber-600/50 transition-all p-6 shadow-xl shadow-black/20">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-stone-900 rounded-xl text-amber-600">
                                    <Tags size={24} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isEditing ? (
                                        <>
                                            <button onClick={handleSaveEdit} className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500">
                                                <Save size={16} />
                                            </button>
                                            <button onClick={handleCancelEdit} className="p-2 bg-stone-700 text-white rounded-lg hover:bg-stone-600">
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(category)} className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(category.id)} className="p-2 text-stone-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg">
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {isEditing ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1 text-lg font-bold font-serif text-stone-50"
                                    />
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="space-y-1">
                                            <span className="text-xs text-stone-500">Tela</span>
                                            <input type="number" value={editForm.fabricCost} onChange={(e) => setEditForm({ ...editForm, fabricCost: Number(e.target.value) })} className="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-stone-500">Confección</span>
                                            <input type="number" value={editForm.confectionCost} onChange={(e) => setEditForm({ ...editForm, confectionCost: Number(e.target.value) })} className="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-stone-500">Estampado</span>
                                            <input type="number" value={editForm.printCost} onChange={(e) => setEditForm({ ...editForm, printCost: Number(e.target.value) })} className="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-stone-500">PVP</span>
                                            <input type="number" value={editForm.suggestedPvp} onChange={(e) => setEditForm({ ...editForm, suggestedPvp: Number(e.target.value) })} className="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold font-serif text-stone-50 mb-4">{category.name}</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-stone-400">
                                            <span>Costo Base:</span>
                                            <span className="text-stone-200 font-medium">
                                                {formatCOP((category.fabricCost || 0) + (category.confectionCost || 0) + (category.printCost || 0) + (category.packagingCost || 0))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-stone-400">
                                            <span>PVP Sugerido:</span>
                                            <span className="text-amber-500 font-medium">{formatCOP(category.suggestedPvp)}</span>
                                        </div>
                                        <div className="pt-3 mt-3 border-t border-stone-700 flex flex-wrap gap-2">
                                            <span className="px-2 py-1 rounded bg-stone-900 text-stone-500 text-xs border border-stone-700">
                                                Tela: {formatCOP(category.fabricCost)}
                                            </span>
                                            <span className="px-2 py-1 rounded bg-stone-900 text-stone-500 text-xs border border-stone-700">
                                                Conf: {formatCOP(category.confectionCost)}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoriesPage;
