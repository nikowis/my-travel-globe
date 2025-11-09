import { useState, useEffect } from "react";
import GlobeComponent from "@/components/Globe";
import CountrySearch from "@/components/CountrySearch";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [totalCountries, setTotalCountries] = useState<number>(0);
  const [allCountries, setAllCountries] = useState<string[]>([]);

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
    
    // Load countries data for search
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        const countryNames = data.features.map((d: any) => 
          d.properties.ADMIN || d.properties.NAME
        ).filter(Boolean);
        setAllCountries(countryNames);
      })
      .catch(err => console.error("Failed to load countries:", err));
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
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <CountrySearch 
          countries={allCountries}
          visitedCountries={visitedCountries}
          onCountrySelect={handleCountryClick}
        />
      </div>
      
      <div className="flex-1 w-full flex items-center justify-center p-4 relative">
        <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30">
          <div className="text-sm font-medium text-foreground">
            {visitedCountries.length}/{totalCountries} ({totalCountries > 0 ? ((visitedCountries.length / totalCountries) * 100).toFixed(1) : 0}%)
          </div>
        </div>
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
