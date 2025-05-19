
export interface Shipment {
  id: string;
  clientId: string;
  clientName: string;
  segment: string;
  business: string;
  state: string;
  city: string;
  orderNumber: string;
  type: string;
  status: string;
  invoiceNumber: string | null;
  statusDescription: string;
  suspensionCode: string;
  description: string;
  freight: number;
  discount: number;
  grossPrice: number;
  netWeight: number;
}

export interface ShipmentStatusCount {
  status: string;
  count: number;
  icon: string;
  label: string;
}

export interface ShipmentSummary {
  activeOrders: number;
  todayDeliveries: number;
  totalValue: number;
  totalWeight: number;
}
