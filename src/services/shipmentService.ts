
import { Shipment, ShipmentStatusCount, ShipmentSummary } from '../types/shipment';

// Dados de amostra (normalmente viriam de uma API)
const shipmentData: Shipment[] = [
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

// Status cards data
const statusCardsData: ShipmentStatusCount[] = [
  { status: 'released', count: 24, icon: 'clipboard', label: 'Pedido liberado' },
  { status: 'committed', count: 18, icon: 'clipboard-check', label: 'Pedido empenhado' },
  { status: 'waiting', count: 12, icon: 'package-check', label: 'Aguardando agenda' },
  { status: 'in-transit', count: 8, icon: 'truck', label: 'Em trânsito' },
  { status: 'partial', count: 3, icon: 'package-x', label: 'Entrega parcial' }
];

// Summary data
const summaryData: ShipmentSummary = {
  activeOrders: 65,
  todayDeliveries: 12,
  totalValue: 58500,
  totalWeight: 27000
};

// Função para recuperar todos os pedidos
export const getAllShipments = (): Promise<Shipment[]> => {
  return Promise.resolve(shipmentData);
};

// Função para pesquisar pedidos
export const searchShipments = (searchTerm: string): Promise<Shipment[]> => {
  const filtered = shipmentData.filter(shipment => 
    shipment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return Promise.resolve(filtered);
};

// Função para ordenar pedidos
export const sortShipments = (shipments: Shipment[], field: keyof Shipment, direction: 'asc' | 'desc'): Promise<Shipment[]> => {
  const sorted = [...shipments].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
  
  return Promise.resolve(sorted);
};

// Função para recuperar contagens de status
export const getStatusCounts = (): Promise<ShipmentStatusCount[]> => {
  return Promise.resolve(statusCardsData);
};

// Função para recuperar resumo de pedidos
export const getShipmentSummary = (): Promise<ShipmentSummary> => {
  return Promise.resolve(summaryData);
};

// Função para recuperar um pedido específico por ID
export const getShipmentById = (id: string): Promise<Shipment | undefined> => {
  const shipment = shipmentData.find(s => s.id === id);
  return Promise.resolve(shipment);
};
