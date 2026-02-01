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
        <aside className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <TrendingUp className="text-black" size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-white">ORVANN</h1>
                        <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Intel Platform</p>
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
                                    ? 'bg-white text-black'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">ORVANN Intel v3.0</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Financial Intelligence</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
