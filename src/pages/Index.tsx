
import React from 'react';
import { Search, RefreshCcw } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusCards from '@/components/dashboard/StatusCards';
import ShipmentsTable from '@/components/dashboard/ShipmentsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Sample data
const shipmentData = [
  {
    id: '1',
    clientId: '2983',
    clientName: 'FARMARIN IND COM LTDA',
    segment: '',
    business: '',
    state: 'SP',
    city: '',
    orderNumber: '181163',
    type: 'SI',
    status: 'pending',
    invoiceNumber: '555',
    statusDescription: 'Empenhar Pedido / LogA',
    suspensionCode: 'CIF',
    description: '',
    freight: 0,
    discount: 0,
    grossPrice: 17493,
    netWeight: 7350
  },
  {
    id: '2',
    clientId: '88967',
    clientName: 'PR DISTRIBUIDORA DE PRODUTOS',
    segment: '',
    business: '',
    state: 'SP',
    city: '',
    orderNumber: '181761',
    type: 'SO',
    status: 'in-transit',
    invoiceNumber: '555',
    statusDescription: 'Empenhar Pedido / LogA',
    suspensionCode: 'FOB',
    description: '',
    freight: 0,
    discount: -50,
    grossPrice: 1075,
    netWeight: 30
  },
  {
    id: '3',
    clientId: '79126',
    clientName: 'BRF S.A',
    segment: '',
    business: '',
    state: 'RS',
    city: '',
    orderNumber: '180758',
    type: 'SI',
    status: 'delivered',
    invoiceNumber: '555',
    statusDescription: 'Empenhar Pedido / LogA',
    suspensionCode: 'FOB',
    description: '',
    freight: 0,
    discount: 0,
    grossPrice: 19547,
    netWeight: 8575
  },
  {
    id: '4',
    clientId: '181707',
    clientName: 'SEARA ALIMENTOS',
    segment: '',
    business: '',
    state: 'MS',
    city: '',
    orderNumber: '181384',
    type: 'SI',
    status: 'in-transit',
    invoiceNumber: '555',
    statusDescription: 'Em Trânsito',
    suspensionCode: 'FOB',
    description: '',
    freight: 0,
    discount: 0,
    grossPrice: 45811,
    netWeight: 17150
  },
  {
    id: '5',
    clientId: '118831',
    clientName: 'SUPERMERCADO ROSSI NEW FOODS',
    segment: '',
    business: '',
    state: 'SP',
    city: '',
    orderNumber: '181693',
    type: 'SO',
    status: 'delivered-partial',
    invoiceNumber: '555',
    statusDescription: 'Entregue Parcial',
    suspensionCode: 'FOB',
    description: '',
    freight: 0,
    discount: -48,
    grossPrice: 8604,
    netWeight: 240
  }
];

const Index: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard de Transportes</h1>
            <p className="text-gray-500 mt-1">Acompanhe todos os seus pedidos e entregas em um só lugar</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Última atualização: 19/05/2025 14:30</span>
            <Button size="sm" variant="ghost" className="p-1">
              <RefreshCcw size={16} />
            </Button>
          </div>
        </div>
        
        <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500">Pedidos ativos</span>
              <h3 className="font-semibold">65</h3>
            </div>
            <div>
              <span className="text-sm text-gray-500">Entregas hoje</span>
              <h3 className="font-semibold">12</h3>
            </div>
            <div>
              <span className="text-sm text-gray-500">Valor total</span>
              <h3 className="font-semibold">R$ 92.530,00</h3>
            </div>
            <div>
              <span className="text-sm text-gray-500">Peso total</span>
              <h3 className="font-semibold">33.345 kg</h3>
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
