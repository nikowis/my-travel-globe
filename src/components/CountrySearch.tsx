import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CountrySearchProps {
  countries: string[];
  visitedCountries: string[];
  onCountrySelect: (country: string) => void;
}

const CountrySearch = ({ countries, visitedCountries, onCountrySelect }: CountrySearchProps) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredCountries = countries
    .filter(country => 
      country.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b));

  const handleSelect = (country: string) => {
    onCountrySelect(country);
    setSearch('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearch('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search countries..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-9 bg-background/80 backdrop-blur-sm border-border/50"
        />
        {search && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {isOpen && (search || filteredCountries.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50">
          <ScrollArea className="h-[300px]">
            <div className="p-2">
              {filteredCountries.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No countries found
                </div>
              ) : (
                filteredCountries.map((country) => {
                  const isVisited = visitedCountries.includes(country);
                  return (
                    <button
                      key={country}
                      onClick={() => handleSelect(country)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors",
                        isVisited && "text-blue-500 font-medium"
                      )}
                    >
                      {country}
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default CountrySearch;
