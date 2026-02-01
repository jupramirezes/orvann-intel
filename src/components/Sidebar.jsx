import React from 'react';
import {
    LayoutDashboard,
    Package,
    Calculator,
    FileText,
    TrendingUp
} from 'lucide-react';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'simulator', label: 'Simulador', icon: Calculator },
    { id: 'quotes', label: 'Cotizaciones', icon: FileText },
];

const Sidebar = ({ currentPage, onNavigate }) => {
    return (
        <aside className="w-64 min-h-screen bg-stone-900 border-r border-stone-800 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-stone-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center border border-stone-200 shadow-lg shadow-black/20">
                        <TrendingUp className="text-stone-900" size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-stone-50 font-serif">ORVANN</h1>
                        <p className="text-[10px] text-amber-600 tracking-widest uppercase font-medium">Intel Platform</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
                                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
                                }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-stone-800">
                <div className="p-4 rounded-xl bg-stone-800 border border-stone-700">
                    <p className="text-xs text-stone-300 font-medium font-serif">ORVANN Intel v3.1</p>
                    <p className="text-[10px] text-stone-500 mt-1">Vintage Edition</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
