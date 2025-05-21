
import React from "react";
import { Bell, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children
}) => {
  return <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-4 h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="relative">
                {/* Updated logo design */}
                <div className="flex items-center justify-center bg-gradient-to-br from-transport-blue-light to-transport-blue-dark p-2 rounded-lg mr-2 relative overflow-hidden shadow-md">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Filter size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtros Rápidos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Entregas de Hoje</DropdownMenuItem>
                <DropdownMenuItem>Pedidos Pendentes</DropdownMenuItem>
                <DropdownMenuItem>Em Trânsito</DropdownMenuItem>
                <DropdownMenuItem>Entregas Atrasadas</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-blue-600">
                  <span className="flex items-center gap-1">
                    <Filter size={14} />
                    Filtros Avançados
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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
        {/* Main content - now full width */}
        <main className="flex-1 overflow-auto w-full">
          {children}
        </main>
      </div>
    </div>;
};

export default DashboardLayout;
