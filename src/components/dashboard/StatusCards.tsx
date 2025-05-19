
import React, { useState, useEffect } from 'react';
import { Clipboard, ClipboardCheck, Truck, PackageCheck, PackageX } from 'lucide-react';
import ShipmentStatusCard from './ShipmentStatusCard';
import { ShipmentStatusCount } from '@/types/shipment';
import { getStatusCounts } from '@/services/shipmentService';

// Map de ícones para os status
const iconMap: Record<string, React.ReactNode> = {
  'clipboard': <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><Clipboard size={20} /></div>,
  'clipboard-check': <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600"><ClipboardCheck size={20} /></div>,
  'package-check': <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600"><PackageCheck size={20} /></div>,
  'truck': <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600"><Truck size={20} /></div>,
  'package-x': <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600"><PackageX size={20} /></div>,
};

const StatusCards: React.FC = () => {
  const [statusCards, setStatusCards] = useState<ShipmentStatusCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatusCards = async () => {
      try {
        const data = await getStatusCounts();
        setStatusCards(data);
      } catch (error) {
        console.error('Error loading status counts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStatusCards();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-24 bg-gray-100 animate-pulse rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statusCards.map((card) => (
        <ShipmentStatusCard 
          key={card.status}
          icon={iconMap[card.icon]}
          label={card.label}
          count={card.count}
        />
      ))}
    </div>
  );
};

export default StatusCards;
