import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Globe2, MapPin } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VisitedListProps {
  visitedCountries: string[];
  onRemoveCountry: (country: string) => void;
}

const VisitedList = ({ visitedCountries, onRemoveCountry }: VisitedListProps) => {
  return (
    <Card className="h-full flex flex-col backdrop-blur-sm bg-card/95 border-border/50">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <Globe2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Visited Countries</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {visitedCountries.length} {visitedCountries.length === 1 ? 'country' : 'countries'} explored
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-6">
        {visitedCountries.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">No countries visited yet</p>
            <p className="text-sm text-muted-foreground/70">Click on a country to mark it as visited</p>
          </div>
        ) : (
          <div className="space-y-2">
            {visitedCountries.map((country) => (
              <div
                key={country}
                className="group flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-foreground font-medium">{country}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  onClick={() => onRemoveCountry(country)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      {visitedCountries.length > 0 && (
        <div className="p-6 border-t border-border/50">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => visitedCountries.forEach(onRemoveCountry)}
          >
            Clear All
          </Button>
        </div>
      )}
    </Card>
  );
};

export default VisitedList;
