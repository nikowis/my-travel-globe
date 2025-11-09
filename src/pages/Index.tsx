import { useState, useEffect } from "react";
import GlobeComponent from "@/components/Globe";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [totalCountries, setTotalCountries] = useState<number>(0);

  // Load visited countries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("visitedCountries");
    if (stored) {
      try {
        setVisitedCountries(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse visited countries:", e);
      }
    }
  }, []);

  // Save visited countries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("visitedCountries", JSON.stringify(visitedCountries));
  }, [visitedCountries]);

  const handleCountryClick = (country: string) => {
    setVisitedCountries((prev) => {
      if (prev.includes(country)) {
        return prev.filter((c) => c !== country);
      }
      return [...prev, country];
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 w-full flex items-center justify-center p-4 relative">
        <Card className="absolute top-8 left-8 z-10 px-6 py-4 bg-card/90 backdrop-blur-sm border-border/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">
              {visitedCountries.length}
              <span className="text-muted-foreground">/{totalCountries}</span>
              <span className="text-lg ml-2 text-muted-foreground">
                ({totalCountries > 0 ? ((visitedCountries.length / totalCountries) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Countries Visited
            </div>
          </div>
        </Card>
        <div className="w-full h-full rounded-xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
          <GlobeComponent 
            visitedCountries={visitedCountries} 
            onCountryClick={handleCountryClick}
            onCountriesLoaded={setTotalCountries}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
