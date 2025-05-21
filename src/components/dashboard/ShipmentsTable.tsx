import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown, Download, Filter, RefreshCcw, ListFilter, FileText, Tag, Calendar, Search, MapPin, ListOrdered, MoveHorizontal, Eye, EyeOff } from 'lucide-react';
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shipment } from '@/types/shipment';
import { getAllShipments, searchShipments, sortShipments } from '@/services/shipmentService';
import FilterDropdown from './FilterDropdown';
import { useToast } from "@/hooks/use-toast";

interface ShipmentsTableProps {
  shipments?: Shipment[];
}

interface ColumnDefinition {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterKey?: string;
  icon?: React.ReactNode;
  align?: 'left' | 'right';
  visible?: boolean;
}

interface ColumnGroup {
  title: string;
  columns: ColumnDefinition[];
}

const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ shipments: initialShipments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Shipment | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Filters state
  const [filters, setFilters] = useState<Record<string, string[]>>({
    status: [],
    segment: [],
    business: [],
    state: [],
  });

  // Initialize column groups
  const [tableColumnGroups, setTableColumnGroups] = useState<ColumnGroup[]>([
    {
      title: "Informações do Cliente",
      columns: [
        { key: 'clientId', label: 'ID Cliente', sortable: true, icon: <Tag size={14} className="mr-1" />, visible: true },
        { key: 'clientName', label: 'Razão Social', sortable: true, icon: <FileText size={14} className="mr-1" />, visible: true },
        { key: 'segment', label: 'Segmento', filterable: true, filterKey: 'segment', icon: <Tag size={14} className="mr-1" />, visible: true },
        { key: 'business', label: 'Business', filterable: true, filterKey: 'business', icon: <FileText size={14} className="mr-1" />, visible: true },
      ]
    },
    {
      title: "Localização",
      columns: [
        { key: 'state', label: 'UF', filterable: true, filterKey: 'state', icon: <MapPin size={14} className="mr-1" />, visible: true },
        { key: 'city', label: 'Município', icon: <MapPin size={14} className="mr-1" />, visible: true },
      ]
    },
    {
      title: "Pedido",
      columns: [
        { key: 'orderNumber', label: 'Número Pedido', sortable: true, icon: <ListOrdered size={14} className="mr-1" />, visible: true },
        { key: 'type', label: 'Tipo', icon: <FileText size={14} className="mr-1" />, visible: true },
        { key: 'statusDescription', label: 'Status', filterable: true, filterKey: 'status', icon: <Calendar size={14} className="mr-1" />, visible: true },
        { key: 'invoiceNumber', label: 'Número Nota', icon: <FileText size={14} className="mr-1" />, visible: true },
        { key: 'suspensionCode', label: 'Código Suspensão', icon: <Tag size={14} className="mr-1" />, visible: true },
        { key: 'description', label: 'Descrição', icon: <FileText size={14} className="mr-1" />, visible: true },
      ]
    },
    {
      title: "Valores",
      columns: [
        { key: 'freight', label: 'Frete', sortable: true, align: 'right', icon: <Tag size={14} className="mr-1" />, visible: true },
        { key: 'discount', label: 'Desconto', align: 'right', icon: <Tag size={14} className="mr-1" />, visible: true },
        { key: 'grossPrice', label: 'Preço Bruto', sortable: true, align: 'right', icon: <Tag size={14} className="mr-1" />, visible: true },
        { key: 'netWeight', label: 'Peso Líquido', sortable: true, align: 'right', icon: <Tag size={14} className="mr-1" />, visible: true },
      ]
    },
  ]);

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

  // Column drag and drop functionality
  const handleDragStart = (key: string) => {
    setDraggedColumn(key);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (targetKey: string) => {
    if (!draggedColumn || draggedColumn === targetKey) {
      return;
    }

    // Create a copy of the column groups
    const updatedColumnGroups = [...tableColumnGroups];

    // Find the dragged column
    let draggedGroupIndex = -1;
    let draggedColumnIndex = -1;
    let targetGroupIndex = -1;
    let targetColumnIndex = -1;

    // Find indices
    updatedColumnGroups.forEach((group, groupIdx) => {
      group.columns.forEach((col, colIdx) => {
        if (col.key === draggedColumn) {
          draggedGroupIndex = groupIdx;
          draggedColumnIndex = colIdx;
        }
        if (col.key === targetKey) {
          targetGroupIndex = groupIdx;
          targetColumnIndex = colIdx;
        }
      });
    });

    // If both columns were found
    if (draggedGroupIndex !== -1 && targetGroupIndex !== -1) {
      // Get the column to move
      const columnToMove = updatedColumnGroups[draggedGroupIndex].columns[draggedColumnIndex];
      
      // Remove it from its original position
      updatedColumnGroups[draggedGroupIndex].columns.splice(draggedColumnIndex, 1);
      
      // Add it at the new position
      updatedColumnGroups[targetGroupIndex].columns.splice(targetColumnIndex, 0, columnToMove);

      // Update the state
      setTableColumnGroups(updatedColumnGroups);

      toast({
        title: "Coluna movida",
        description: `A coluna ${columnToMove.label} foi movida com sucesso.`,
        duration: 2000,
      });
    }

    setDraggedColumn(null);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (groupIndex: number, columnIndex: number) => {
    const updatedColumnGroups = [...tableColumnGroups];
    const column = updatedColumnGroups[groupIndex].columns[columnIndex];
    column.visible = !column.visible;
    
    setTableColumnGroups(updatedColumnGroups);
    
    toast({
      title: column.visible ? "Coluna exibida" : "Coluna ocultada",
      description: `A coluna ${column.label} foi ${column.visible ? 'exibida' : 'ocultada'}.`,
      duration: 2000,
    });
  };

  // Reset column order to default
  const resetColumnOrder = () => {
    // This would reset to the original order - you'd need to keep the original order somewhere
    // For this example, we'll just reload the page which will reset to the default
    window.location.reload();
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

  // Get all visible columns across groups for the table body
  const visibleColumns = tableColumnGroups.flatMap(group => 
    group.columns.filter(column => column.visible)
  );

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
            <Search size={16} />
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-sm">
                <MoveHorizontal size={14} />
                <span>Colunas</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Gerenciar Colunas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetColumnOrder}>
                Restaurar ordem padrão
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto p-1">
                {tableColumnGroups.map((group, groupIdx) => (
                  <React.Fragment key={`group-${groupIdx}`}>
                    <DropdownMenuLabel className="text-xs text-gray-500 pt-2">
                      {group.title}
                    </DropdownMenuLabel>
                    {group.columns.map((column, colIdx) => (
                      <ContextMenu key={column.key}>
                        <ContextMenuTrigger>
                          <DropdownMenuCheckboxItem
                            checked={column.visible}
                            onCheckedChange={() => toggleColumnVisibility(groupIdx, colIdx)}
                            className="cursor-pointer flex justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {column.icon}
                              <span>{column.label}</span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {column.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                            </span>
                          </DropdownMenuCheckboxItem>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem onClick={() => toggleColumnVisibility(groupIdx, colIdx)}>
                            {column.visible ? "Ocultar coluna" : "Mostrar coluna"}
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
            {/* Group headers */}
            <TableRow className="bg-gray-100 hover:bg-gray-100 border-b-0">
              {tableColumnGroups.map((group, groupIndex) => {
                const visibleColumns = group.columns.filter(col => col.visible);
                if (visibleColumns.length === 0) return null;
                
                return (
                  <TableHead 
                    key={`group-${groupIndex}`}
                    colSpan={visibleColumns.length}
                    className="text-center font-semibold text-xs text-gray-600 uppercase tracking-wider py-2 border-r border-gray-200 last:border-r-0"
                  >
                    {group.title}
                  </TableHead>
                );
              })}
            </TableRow>
            
            {/* Individual column headers */}
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              {tableColumnGroups.flatMap((group, groupIndex) => 
                group.columns
                  .filter(column => column.visible)
                  .map((column, columnIndex) => (
                    <TableHead 
                      key={`col-${column.key}`}
                      draggable
                      onDragStart={() => handleDragStart(column.key)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(column.key)}
                      className={`font-medium text-xs py-3 border-r border-gray-200 last:border-r-0 ${column.align === 'right' ? 'text-right' : 'text-left'} cursor-move`}
                      onClick={() => column.sortable ? handleSort(column.key as keyof Shipment) : undefined}
                    >
                      <div className={`flex items-center ${column.align === 'right' ? 'justify-end' : 'justify-between'}`}>
                        <div className="flex items-center">
                          {column.icon}
                          <span>{column.label}</span>
                        </div>
                        
                        <div className="flex items-center">
                          {column.sortable && sortField === column.key && (
                            <ArrowUpDown size={14} className="ml-1 inline" />
                          )}
                          
                          {column.filterable && (
                            <FilterDropdown 
                              title={column.label}
                              options={filterOptions[column.filterKey as keyof typeof filterOptions]}
                              selectedOptions={filters[column.filterKey]}
                              onSelectionChange={(value) => handleFilterChange(column.filterKey, value)}
                              onClearFilters={() => clearColumnFilters(column.filterKey)}
                            />
                          )}
                        </div>
                      </div>
                    </TableHead>
                  ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="text-center py-8 text-gray-500">
                  Carregando dados...
                </TableCell>
              </TableRow>
            ) : filteredShipments.length > 0 ? (
              filteredShipments.map((shipment) => (
                <TableRow 
                  key={`${shipment.clientId}-${shipment.orderNumber}`}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {visibleColumns.map((column) => {
                    const value = shipment[column.key as keyof Shipment];
                    
                    // Special rendering for status badge
                    if (column.key === 'statusDescription') {
                      return <TableCell key={column.key}>{getStatusBadge(shipment.statusDescription)}</TableCell>;
                    }
                    
                    // Special rendering for currency values
                    if (column.key === 'freight' || column.key === 'grossPrice') {
                      return (
                        <TableCell key={column.key} className="text-right">
                          {formatCurrency(value as number)}
                        </TableCell>
                      );
                    }
                    
                    // Default rendering
                    return (
                      <TableCell 
                        key={column.key} 
                        className={column.align === 'right' ? 'text-right' : ''}
                      >
                        {value as React.ReactNode}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="text-center py-8 text-gray-500">
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
