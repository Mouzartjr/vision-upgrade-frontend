import React, { useState } from "react";
import { Search, Menu, Bell, RefreshCcw, X, Truck, Package, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-4 h-16">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
              <Menu size={20} />
            </button>
            <div className="flex items-center">
              <div className="relative">
                {/* Updated logo design */}
                <div className="flex items-center justify-center bg-gradient-to-br from-transport-blue-light to-transport-blue-dark p-2 rounded-lg mr-2 relative overflow-hidden shadow-md">
                  <Globe size={10} className="absolute top-1 left-1 text-blue-200 opacity-70" />
                  <Truck size={20} className="text-white relative z-10" />
                  <Package size={12} className="text-white absolute right-1 bottom-1 z-20" />
                  <div className="absolute inset-0 bg-white opacity-20 rounded-full scale-0 origin-center transition-transform group-hover:scale-100"></div>
                </div>
              </div>
              <h1 className="text-xl font-bold">
                <span className="bg-gradient-to-r from-transport-blue to-transport-blue-dark bg-clip-text text-transparent">Cockpit de</span>
                <span className="text-gray-800"> Transportes</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell size={18} />
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-transport-blue to-transport-blue-dark text-white flex items-center justify-center">
              <span className="font-medium text-sm">AT</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={cn("bg-sidebar w-64 flex flex-col transition-all duration-300 ease-in-out", sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0", "fixed md:static left-0 top-16 bottom-0 z-40 md:z-0")}>
          <div className="flex flex-col h-full p-4 text-white space-y-6">
            <div className="md:hidden flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-white hover:bg-sidebar-accent">
                <X size={18} />
              </Button>
            </div>
            
            <nav className="space-y-1">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-sidebar-accent">
                <div className="w-8 h-8 rounded-md bg-transport-blue-light flex items-center justify-center">
                  <span className="text-xs font-bold">DB</span>
                </div>
                <span className="font-medium">Dashboard</span>
              </a>
              
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent">
                <div className="w-8 h-8 rounded-md bg-sidebar-accent flex items-center justify-center">
                  <span className="text-xs font-bold">PD</span>
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
              
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
          {children}
        </main>
      </div>
    </div>;
};
export default DashboardLayout;