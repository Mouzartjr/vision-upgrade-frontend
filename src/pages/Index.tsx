
import React from 'react';
import { Search, RefreshCcw } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusCards from '@/components/dashboard/StatusCards';
import ShipmentsTable from '@/components/dashboard/ShipmentsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Sample data with generic entries
const shipmentData = [
  {
    id: '1',
    clientId: '0001',
    clientName: 'Cliente Exemplo A',
    segment: '',
    business: '',
    state: 'SP',
    city: '',
    orderNumber: '100001',
    type: 'SI',
    status: 'pending',
    invoiceNumber: '001',
    statusDescription: 'Empenhar Pedido',
    suspensionCode: 'CIF',
    description: '',
    freight: 0,
    discount: 0,
    grossPrice: 10000,
    netWeight: 5000
  },
  {
    id: '2',
    clientId: '0002',
    clientName: 'Cliente Exemplo B',
    segment: '',
    business: '',
    state: 'RJ',
    city: '',
    orderNumber: '100002',
    type: 'SO',
    status: 'in-transit',
    invoiceNumber: '002',
    statusDescription: 'Em Trânsito',
    suspensionCode: 'FOB',
    description: '',
    freight: 0,
    discount: 0,
    grossPrice: 8500,
    netWeight: 3000
  },
  {
    id: '3',
    clientId: '0003',
    clientName: 'Cliente Exemplo C',
    segment: '',
    business: '',
    state: 'MG',
    city: '',
    orderNumber: '100003',
    type: 'SI',
    status: 'delivered',
    invoiceNumber: '003',
    statusDescription: 'Entregue',
    suspensionCode: 'FOB',
    description: '',
    freight: 0,
    discount: 0,
    grossPrice: 15000,
    netWeight: 7500
  },
  {
    id: '4',
    clientId: '0004',
    clientName: 'Cliente Exemplo D',
    segment: '',
    business: '',
    state: 'RS',
    city: '',
    orderNumber: '100004',
    type: 'SI',
    status: 'in-transit',
    invoiceNumber: '004',
    statusDescription: 'Em Trânsito',
    suspensionCode: 'FOB',
    description: '',
    freight: 0,
    discount: 0,
    grossPrice: 20000,
    netWeight: 9000
  },
  {
    id: '5',
    clientId: '0005',
    clientName: 'Cliente Exemplo E',
    segment: '',
    business: '',
    state: 'PR',
    city: '',
    orderNumber: '100005',
    type: 'SO',
    status: 'delivered-partial',
    invoiceNumber: '005',
    statusDescription: 'Entregue Parcial',
    suspensionCode: 'FOB',
    description: '',
    freight: 0,
    discount: 0,
    grossPrice: 5000,
    netWeight: 2500
  }
];

const Index: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-transport-blue bg-gradient-to-r from-transport-blue to-transport-blue-dark bg-clip-text text-transparent">Dashboard de Transportes</h1>
            <p className="text-gray-500 mt-1">Acompanhe todos os seus pedidos e entregas em um só lugar</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Última atualização: 19/05/2025 14:30</span>
            <Button size="sm" variant="outline" className="p-1 rounded-full hover:bg-blue-50">
              <RefreshCcw size={16} className="text-transport-blue" />
            </Button>
          </div>
        </div>
        
        <div className="h-auto py-4 flex items-center px-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Pedidos ativos</span>
              <h3 className="font-semibold text-transport-blue">--</h3>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Entregas hoje</span>
              <h3 className="font-semibold text-transport-blue">--</h3>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Valor total</span>
              <h3 className="font-semibold text-transport-blue">R$ --</h3>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Peso total</span>
              <h3 className="font-semibold text-transport-blue">-- kg</h3>
            </div>
          </div>
        </div>
        
        <StatusCards />
        
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Pedidos e Entregas</h2>
          <ShipmentsTable shipments={shipmentData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
