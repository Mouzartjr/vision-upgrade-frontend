
import React from 'react';
import { Check, Filter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface FilterDropdownProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (value: string) => void;
  onClearFilters: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options,
  selectedOptions,
  onSelectionChange,
  onClearFilters,
}) => {
  const hasActiveFilters = selectedOptions.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-7 gap-1 ${hasActiveFilters ? 'bg-blue-50 text-blue-700' : ''}`}
        >
          <Filter size={14} />
          <span className="hidden sm:inline">{title}</span>
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-transport-blue text-[10px] text-white">
              {selectedOptions.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Filtrar por {title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {options.length > 0 ? (
          options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={selectedOptions.includes(option)}
              onCheckedChange={() => onSelectionChange(option)}
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <DropdownMenuItem disabled>Sem opções disponíveis</DropdownMenuItem>
        )}
        
        {hasActiveFilters && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onClearFilters}
              className="text-red-500 focus:text-red-500"
            >
              <X size={14} className="mr-2" />
              Limpar filtros
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
