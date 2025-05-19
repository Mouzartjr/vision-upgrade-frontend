
import React from 'react';
import { cn } from '@/lib/utils';

interface ShipmentStatusCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  className?: string;
}

const ShipmentStatusCard: React.FC<ShipmentStatusCardProps> = ({ icon, label, count, className }) => {
  return (
    <div className={cn("flex items-center p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]", className)}>
      <div className="mr-4 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold bg-gradient-to-r from-transport-blue to-transport-blue-light bg-clip-text text-transparent">{count}</p>
      </div>
    </div>
  );
};

export default ShipmentStatusCard;
