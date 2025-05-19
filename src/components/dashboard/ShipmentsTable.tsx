
import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Download, Filter, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Shipment } from '@/types/shipment';
import { getAllShipments, searchShipments, sortShipments } from '@/services/shipmentService';

interface ShipmentsTableProps {
  shipments?: Shipment[];
}

const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ shipments: initialShipments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Shipment | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados na inicialização, se não forem fornecidos
  useEffect(() => {
    if (initialShipments) {
      setShipments(initialShipments);
    } else {
      loadShipments();
    }
  }, [initialShipments]);

  const loadShipments = async () => {
    setLoading(true);
    try {
      const data = await getAllShipments();
      setShipments(data);
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = async (field: keyof Shipment) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    
    try {
      const sorted = await sortShipments(shipments, field, newDirection);
      setShipments(sorted);
    } catch (error) {
      console.error('Error sorting shipments:', error);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      loadShipments();
      return;
    }
    
    try {
      const results = await searchShipments(query);
      setShipments(results);
    } catch (error) {
      console.error('Error searching shipments:', error);
    }
  };

  const handleRefresh = () => {
    loadShipments();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Empenhar Pedido':
      case 'Empenhar Pedido / LogA':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'Em Trânsito':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Em Trânsito</Badge>;
      case 'Entregue':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Entregue</Badge>;
      case 'Entregue Parcial':
        return <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">Entregue Parcial</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-auto md:min-w-[360px]">
          <Input
            placeholder="Buscar por cliente, pedido, ID..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Filter size={16} />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <Button variant="outline" size="sm" className="flex items-center gap-1 text-sm" onClick={handleRefresh}>
            <RefreshCcw size={14} />
            <span>Atualizar</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 text-sm">
            <Download size={14} />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-medium" onClick={() => handleSort('clientId')}>
                ID Cliente
                {sortField === 'clientId' && (
                  <ArrowUpDown size={14} className="ml-1 inline" />
                )}
              </TableHead>
              <TableHead className="font-medium" onClick={() => handleSort('clientName')}>
                Razão Social
                {sortField === 'clientName' && (
                  <ArrowUpDown size={14} className="ml-1 inline" />
                )}
              </TableHead>
              <TableHead className="font-medium">Segmento</TableHead>
              <TableHead className="font-medium">Business</TableHead>
              <TableHead className="font-medium">UF</TableHead>
              <TableHead className="font-medium">Município</TableHead>
              <TableHead className="font-medium" onClick={() => handleSort('orderNumber')}>
                Número Pedido
                {sortField === 'orderNumber' && (
                  <ArrowUpDown size={14} className="ml-1 inline" />
                )}
              </TableHead>
              <TableHead className="font-medium">Tipo</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Número Nota</TableHead>
              <TableHead className="font-medium">Código Suspensão</TableHead>
              <TableHead className="font-medium">Descrição</TableHead>
              <TableHead className="font-medium text-right" onClick={() => handleSort('freight')}>
                Frete
                {sortField === 'freight' && (
                  <ArrowUpDown size={14} className="ml-1 inline" />
                )}
              </TableHead>
              <TableHead className="font-medium text-right">Desconto</TableHead>
              <TableHead className="font-medium text-right" onClick={() => handleSort('grossPrice')}>
                Preço Bruto
                {sortField === 'grossPrice' && (
                  <ArrowUpDown size={14} className="ml-1 inline" />
                )}
              </TableHead>
              <TableHead className="font-medium text-right" onClick={() => handleSort('netWeight')}>
                Peso Líquido
                {sortField === 'netWeight' && (
                  <ArrowUpDown size={14} className="ml-1 inline" />
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-8 text-gray-500">
                  Carregando dados...
                </TableCell>
              </TableRow>
            ) : shipments.length > 0 ? (
              shipments.map((shipment) => (
                <TableRow 
                  key={`${shipment.clientId}-${shipment.orderNumber}`}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <TableCell className="font-medium">{shipment.clientId}</TableCell>
                  <TableCell>{shipment.clientName}</TableCell>
                  <TableCell>{shipment.segment}</TableCell>
                  <TableCell>{shipment.business}</TableCell>
                  <TableCell>{shipment.state}</TableCell>
                  <TableCell>{shipment.city}</TableCell>
                  <TableCell>{shipment.orderNumber}</TableCell>
                  <TableCell>{shipment.type}</TableCell>
                  <TableCell>{getStatusBadge(shipment.statusDescription)}</TableCell>
                  <TableCell>{shipment.invoiceNumber}</TableCell>
                  <TableCell>{shipment.suspensionCode}</TableCell>
                  <TableCell>{shipment.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(shipment.freight)}</TableCell>
                  <TableCell className="text-right">{shipment.discount}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(shipment.grossPrice)}</TableCell>
                  <TableCell className="text-right">{shipment.netWeight}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-8 text-gray-500">
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-gray-100">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ShipmentsTable;
