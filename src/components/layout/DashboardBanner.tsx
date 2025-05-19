
import React from "react";
import { Truck, Package, BarChart3 } from "lucide-react";

const DashboardBanner = () => {
  return (
    <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-lg mb-6">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transport-blue-dark via-transport-blue to-blue-400"></div>
      
      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-10">
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path fill="white" fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,154.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>
      
      {/* Left side content */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Cockpit de Transportes
          </h1>
          <p className="text-blue-100 md:text-lg max-w-md">
            Gerenciamento inteligente da sua logística
          </p>
        </div>
        
        {/* Right side illustration */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="relative">
            {/* Truck animation */}
            <div className="absolute -left-24 top-0 animate-pulse">
              <div className="bg-white/10 p-3 rounded-lg">
                <Truck size={40} className="text-white" />
              </div>
            </div>
            
            {/* Package animation */}
            <div className="absolute -right-16 bottom-4">
              <div className="bg-white/10 p-3 rounded-lg animate-bounce">
                <Package size={32} className="text-white" />
              </div>
            </div>
            
            {/* Chart animation */}
            <div className="bg-white/10 p-4 rounded-lg">
              <BarChart3 size={60} className="text-white" />
            </div>
            
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full bg-blue-300/10"></div>
            <div className="absolute -left-10 -bottom-6 w-20 h-20 rounded-full bg-blue-300/10"></div>
          </div>
        </div>
      </div>
      
      {/* Small decoration dots */}
      <div className="absolute top-6 right-8 flex space-x-1">
        <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
        <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
        <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default DashboardBanner;
