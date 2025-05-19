
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
    <div className={cn("flex items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  );
};

export default ShipmentStatusCard;
