
import React from 'react';
import { Clipboard, ClipboardCheck, Truck, PackageCheck, PackageX } from 'lucide-react';
import ShipmentStatusCard from './ShipmentStatusCard';

const StatusCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <ShipmentStatusCard 
        icon={<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><Clipboard size={20} /></div>}
        label="Pedido liberado"
        count={24}
      />
      <ShipmentStatusCard 
        icon={<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600"><ClipboardCheck size={20} /></div>}
        label="Pedido empenhado"
        count={18}
      />
      <ShipmentStatusCard 
        icon={<div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600"><PackageCheck size={20} /></div>}
        label="Aguardando agenda"
        count={12}
      />
      <ShipmentStatusCard 
        icon={<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600"><Truck size={20} /></div>}
        label="Em trânsito"
        count={8}
      />
      <ShipmentStatusCard 
        icon={<div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600"><PackageX size={20} /></div>}
        label="Entrega parcial"
        count={3}
      />
    </div>
  );
};

export default StatusCards;
