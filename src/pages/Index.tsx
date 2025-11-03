import { useState, useEffect } from 'react';
import GlobeComponent from '@/components/Globe';
import VisitedList from '@/components/VisitedList';

const Index = () => {
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);

  // Load visited countries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('visitedCountries');
    if (stored) {
      try {
        setVisitedCountries(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse visited countries:', e);
      }
    }
  }, []);

  // Save visited countries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('visitedCountries', JSON.stringify(visitedCountries));
  }, [visitedCountries]);

  const handleCountryClick = (country: string) => {
    setVisitedCountries(prev => {
      if (prev.includes(country)) {
        return prev.filter(c => c !== country);
      }
      return [...prev, country];
    });
  };

  const handleRemoveCountry = (country: string) => {
    setVisitedCountries(prev => prev.filter(c => c !== country));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            World Travel Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Click on countries to mark them as visited • Drag to rotate the globe
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6 h-[calc(100vh-200px)]">
          <div className="rounded-xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
            <GlobeComponent
              visitedCountries={visitedCountries}
              onCountryClick={handleCountryClick}
            />
          </div>
          
          <div className="hidden lg:block">
            <VisitedList
              visitedCountries={visitedCountries}
              onRemoveCountry={handleRemoveCountry}
            />
          </div>
        </div>

        {/* Mobile visited list */}
        <div className="lg:hidden mt-6">
          <VisitedList
            visitedCountries={visitedCountries}
            onRemoveCountry={handleRemoveCountry}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
