import React from 'react';
import { LayoutDashboard, Wallet, Bell, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href }) => {
    const location = useLocation();
    const isActive = location.pathname === href;

    return (
        <Link to={href}>
            <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer",
                isActive ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-foreground")} />
                <span className="font-medium">{label}</span>
            </div>
        </Link>
    );
};

const Header = () => (
    <header className="h-16 border-b border-border bg-white/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">
                Overview
            </h2>
        </div>
        <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
                <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">JD</span>
            </div>
        </div>
    </header>
);

const Sidebar = () => (
    <aside className="w-64 border-r border-border bg-card h-screen flex flex-col fixed left-0 top-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-border">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Wallet className="w-6 h-6" />
                Stocker
            </h1>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/" />
            <SidebarItem icon={Wallet} label="Portfolio" href="/portfolio" />
            <SidebarItem icon={Bell} label="Alerts" href="/alerts" />
        </nav>

        <div className="p-4 border-t border-border mt-auto">
            <SidebarItem icon={Settings} label="Settings" href="/settings" />
            <div className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors mt-2">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
            </div>
        </div>
    </aside>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                <Header />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 p-6"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};
