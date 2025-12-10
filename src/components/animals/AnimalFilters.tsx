import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface FiltersState {
  search: string;
  species: string[];
  size: string[];
  status: string[];
  sortBy: string;
}

interface AnimalFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
}

const speciesOptions = ["Dog", "Cat", "Rabbit"];
const sizeOptions = ["small", "medium", "large"];
const statusOptions = ["Therapy Certified", "Available for Adoption", "Part-time Pet", "In Rehabilitation"];
const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "age-asc", label: "Age (Youngest)" },
  { value: "age-desc", label: "Age (Oldest)" },
  { value: "arrival", label: "Arrival Date" },
];

const FilterContent = ({ filters, onFiltersChange }: AnimalFiltersProps) => {
  const toggleFilter = (category: "species" | "size" | "status", value: string) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [category]: updated });
  };

  return (
    <div className="space-y-6">
      {/* Species Filter */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Species</Label>
        <div className="space-y-2">
          {speciesOptions.map((species) => (
            <div key={species} className="flex items-center gap-2">
              <Checkbox
                id={`species-${species}`}
                checked={filters.species.includes(species)}
                onCheckedChange={() => toggleFilter("species", species)}
              />
              <label htmlFor={`species-${species}`} className="text-sm cursor-pointer">
                {species}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Size</Label>
        <div className="space-y-2">
          {sizeOptions.map((size) => (
            <div key={size} className="flex items-center gap-2">
              <Checkbox
                id={`size-${size}`}
                checked={filters.size.includes(size)}
                onCheckedChange={() => toggleFilter("size", size)}
              />
              <label htmlFor={`size-${size}`} className="text-sm cursor-pointer capitalize">
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Status</Label>
        <div className="space-y-2">
          {statusOptions.map((status) => (
            <div key={status} className="flex items-center gap-2">
              <Checkbox
                id={`status-${status}`}
                checked={filters.status.includes(status)}
                onCheckedChange={() => toggleFilter("status", status)}
              />
              <label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                {status}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onFiltersChange({ search: "", species: [], size: [], status: [], sortBy: "name" })}
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export const AnimalFilters = ({ filters, onFiltersChange }: AnimalFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search animals..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filter Animals</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar Filters */}
      <div className="hidden lg:block">
        <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
      </div>
    </div>
  );
};

export const AnimalFiltersSidebar = ({ filters, onFiltersChange }: AnimalFiltersProps) => {
  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 bg-card rounded-xl p-6 border">
        <h3 className="font-heading font-semibold mb-4">Filters</h3>
        <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
      </div>
    </div>
  );
};
