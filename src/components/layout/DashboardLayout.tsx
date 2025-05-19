
import React, { useState } from "react";
import { Search, Menu, Bell, RefreshCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-4 h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-transport-blue">Cockpit de Transportes</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell size={18} />
            </Button>
            <div className="h-8 w-8 rounded-full bg-transport-blue text-white flex items-center justify-center">
              <span className="font-medium text-sm">AT</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "bg-sidebar w-64 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "fixed md:static left-0 top-16 bottom-0 z-40 md:z-0"
        )}>
          <div className="flex flex-col h-full p-4 text-white space-y-6">
            <div className="md:hidden flex justify-end">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:bg-sidebar-accent"
              >
                <X size={18} />
              </Button>
            </div>
            
            <nav className="space-y-1">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-sidebar-accent">
                <div className="w-8 h-8 rounded-md bg-transport-blue-light flex items-center justify-center">
                  <span className="text-xs font-bold">TP</span>
                </div>
                <span className="font-medium">Dashboard</span>
              </a>
              
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent">
                <div className="w-8 h-8 rounded-md bg-sidebar-accent flex items-center justify-center">
                  <span className="text-xs font-bold">PE</span>
                </div>
                <span>Pedidos</span>
              </a>
              
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent">
                <div className="w-8 h-8 rounded-md bg-sidebar-accent flex items-center justify-center">
                  <span className="text-xs font-bold">FR</span>
                </div>
                <span>Fretes</span>
              </a>
              
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent">
                <div className="w-8 h-8 rounded-md bg-sidebar-accent flex items-center justify-center">
                  <span className="text-xs font-bold">EN</span>
                </div>
                <span>Entregas</span>
              </a>
              
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent">
                <div className="w-8 h-8 rounded-md bg-sidebar-accent flex items-center justify-center">
                  <span className="text-xs font-bold">RL</span>
                </div>
                <span>Relatórios</span>
              </a>
            </nav>
            
            <div className="mt-auto">
              <div className="bg-sidebar-accent p-4 rounded-lg">
                <h3 className="font-medium mb-2">Precisa de ajuda?</h3>
                <p className="text-sm text-white/80 mb-3">Entre em contato com o suporte técnico</p>
                <Button size="sm" className="w-full bg-white text-sidebar hover:bg-gray-100">
                  Suporte
                </Button>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-30 md:hidden" 
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
