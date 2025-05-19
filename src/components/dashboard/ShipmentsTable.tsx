import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown, Download, Filter, RefreshCcw, ListFilter } from 'lucide-react';
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
import FilterDropdown from './FilterDropdown';
import { useToast } from "@/hooks/use-toast";

interface ShipmentsTableProps {
  shipments?: Shipment[];
}

const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ shipments: initialShipments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Shipment | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Filters state
  const [filters, setFilters] = useState<Record<string, string[]>>({
    status: [],
    segment: [],
    business: [],
    state: [],
  });

  // Carregar dados na inicialização, se não forem fornecidos
  useEffect(() => {
    if (initialShipments) {
      setShipments(initialShipments);
      setFilteredShipments(initialShipments);
    } else {
      loadShipments();
    }
  }, [initialShipments]);

  const loadShipments = async () => {
    setLoading(true);
    try {
      const data = await getAllShipments();
      setShipments(data);
      setFilteredShipments(data);
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique values for each filter column
  const filterOptions = useMemo(() => {
    return {
      status: [...new Set(shipments.map(s => s.statusDescription))],
      segment: [...new Set(shipments.map(s => s.segment))],
      business: [...new Set(shipments.map(s => s.business))],
      state: [...new Set(shipments.map(s => s.state))],
    };
  }, [shipments]);

  // Apply all filters
  useEffect(() => {
    let result = [...shipments];
    
    // Apply filters
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        result = result.filter(shipment => 
          values.includes(shipment[key as keyof Shipment] as string)
        );
      }
    });
    
    // Apply search query if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(shipment => 
        shipment.clientName.toLowerCase().includes(query) ||
        shipment.orderNumber.toLowerCase().includes(query) ||
        shipment.clientId.toLowerCase().includes(query) ||
        (shipment.invoiceNumber && shipment.invoiceNumber.toLowerCase().includes(query))
      );
    }
    
    setFilteredShipments(result);
  }, [filters, shipments, searchQuery]);

  // Handle filter changes
  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => {
      const currentValues = prev[column] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
        
      return {
        ...prev,
        [column]: updatedValues
      };
    });
  };

  // Clear filters for a specific column
  const clearColumnFilters = (column: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: []
    }));
    
    toast({
      title: "Filtros limpos",
      description: `Os filtros de ${column} foram removidos.`,
      duration: 2000,
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      status: [],
      segment: [],
      business: [],
      state: [],
    });
    setSearchQuery('');
    
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
      duration: 2000,
    });
  };

  // Handle sorting
  const handleSort = async (field: keyof Shipment) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    
    try {
      const sorted = await sortShipments(filteredShipments, field, newDirection);
      setFilteredShipments(sorted);
    } catch (error) {
      console.error('Error sorting shipments:', error);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    loadShipments();
    clearAllFilters();
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

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0) || searchQuery.trim() !== '';

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
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700" 
              onClick={clearAllFilters}
            >
              <ListFilter size={14} />
              <span>Limpar filtros</span>
            </Button>
          )}
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
                <div className="flex items-center justify-between">
                  <span>ID Cliente</span>
                  {sortField === 'clientId' && (
                    <ArrowUpDown size={14} className="ml-1 inline" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-medium" onClick={() => handleSort('clientName')}>
                <div className="flex items-center justify-between">
                  <span>Razão Social</span>
                  {sortField === 'clientName' && (
                    <ArrowUpDown size={14} className="ml-1 inline" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-medium">
                <div className="flex items-center justify-between">
                  <span>Segmento</span>
                  <FilterDropdown 
                    title="Segmento"
                    options={filterOptions.segment}
                    selectedOptions={filters.segment}
                    onSelectionChange={(value) => handleFilterChange('segment', value)}
                    onClearFilters={() => clearColumnFilters('segment')}
                  />
                </div>
              </TableHead>
              <TableHead className="font-medium">
                <div className="flex items-center justify-between">
                  <span>Business</span>
                  <FilterDropdown 
                    title="Business"
                    options={filterOptions.business}
                    selectedOptions={filters.business}
                    onSelectionChange={(value) => handleFilterChange('business', value)}
                    onClearFilters={() => clearColumnFilters('business')}
                  />
                </div>
              </TableHead>
              <TableHead className="font-medium">
                <div className="flex items-center justify-between">
                  <span>UF</span>
                  <FilterDropdown 
                    title="UF"
                    options={filterOptions.state}
                    selectedOptions={filters.state}
                    onSelectionChange={(value) => handleFilterChange('state', value)}
                    onClearFilters={() => clearColumnFilters('state')}
                  />
                </div>
              </TableHead>
              <TableHead className="font-medium">
                <span>Município</span>
              </TableHead>
              <TableHead className="font-medium" onClick={() => handleSort('orderNumber')}>
                <div className="flex items-center justify-between">
                  <span>Número Pedido</span>
                  {sortField === 'orderNumber' && (
                    <ArrowUpDown size={14} className="ml-1 inline" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-medium">
                <span>Tipo</span>
              </TableHead>
              <TableHead className="font-medium">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <FilterDropdown 
                    title="Status"
                    options={filterOptions.status}
                    selectedOptions={filters.status}
                    onSelectionChange={(value) => handleFilterChange('statusDescription', value)}
                    onClearFilters={() => clearColumnFilters('status')}
                  />
                </div>
              </TableHead>
              <TableHead className="font-medium">
                <span>Número Nota</span>
              </TableHead>
              <TableHead className="font-medium">
                <span>Código Suspensão</span>
              </TableHead>
              <TableHead className="font-medium">
                <span>Descrição</span>
              </TableHead>
              <TableHead className="font-medium text-right" onClick={() => handleSort('freight')}>
                <div className="flex items-center justify-between">
                  <span>Frete</span>
                  {sortField === 'freight' && (
                    <ArrowUpDown size={14} className="ml-1 inline" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-medium text-right">
                <span>Desconto</span>
              </TableHead>
              <TableHead className="font-medium text-right" onClick={() => handleSort('grossPrice')}>
                <div className="flex items-center justify-between">
                  <span>Preço Bruto</span>
                  {sortField === 'grossPrice' && (
                    <ArrowUpDown size={14} className="ml-1 inline" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-medium text-right" onClick={() => handleSort('netWeight')}>
                <div className="flex items-center justify-between">
                  <span>Peso Líquido</span>
                  {sortField === 'netWeight' && (
                    <ArrowUpDown size={14} className="ml-1 inline" />
                  )}
                </div>
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
            ) : filteredShipments.length > 0 ? (
              filteredShipments.map((shipment) => (
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
