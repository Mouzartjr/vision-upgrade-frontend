
import React, { useState, useEffect } from 'react';
import { Search, RefreshCcw } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusCards from '@/components/dashboard/StatusCards';
import ShipmentsTable from '@/components/dashboard/ShipmentsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllShipments, getShipmentSummary } from '@/services/shipmentService';
import { ShipmentSummary } from '@/types/shipment';

const Index: React.FC = () => {
  const [summary, setSummary] = useState<ShipmentSummary | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString('pt-BR'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const summaryData = await getShipmentSummary();
      setSummary(summaryData);
      setLastUpdated(new Date().toLocaleString('pt-BR'));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-transport-blue bg-gradient-to-r from-transport-blue to-transport-blue-dark bg-clip-text text-transparent">Dashboard de Transportes</h1>
            <p className="text-gray-500 mt-1">Acompanhe todos os seus pedidos e entregas em um só lugar</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Última atualização: {lastUpdated}</span>
            <Button size="sm" variant="outline" className="p-1 rounded-full hover:bg-blue-50" onClick={handleRefresh}>
              <RefreshCcw size={16} className="text-transport-blue" />
            </Button>
          </div>
        </div>
        
        <div className="h-auto py-4 flex items-center px-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Pedidos ativos</span>
              <h3 className="font-semibold text-transport-blue">{loading ? '--' : summary?.activeOrders || '--'}</h3>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Entregas hoje</span>
              <h3 className="font-semibold text-transport-blue">{loading ? '--' : summary?.todayDeliveries || '--'}</h3>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Valor total</span>
              <h3 className="font-semibold text-transport-blue">
                {loading ? 'R$ --' : `R$ ${new Intl.NumberFormat('pt-BR').format(summary?.totalValue || 0)}`}
              </h3>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Peso total</span>
              <h3 className="font-semibold text-transport-blue">
                {loading ? '-- kg' : `${new Intl.NumberFormat('pt-BR').format(summary?.totalWeight || 0)} kg`}
              </h3>
            </div>
          </div>
        </div>
        
        <StatusCards />
        
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Pedidos e Entregas</h2>
          <ShipmentsTable />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
