import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { toast } from 'sonner';

interface GlobeComponentProps {
  visitedCountries: string[];
  onCountryClick: (country: string) => void;
}

const GlobeComponent = ({ visitedCountries, onCountryClick }: GlobeComponentProps) => {
  const globeEl = useRef<any>();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState<any>(null);

  useEffect(() => {
    // Load country data
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
    }
  }, []);

  const getPolygonColor = (d: any) => {
    const countryName = d.properties.ADMIN || d.properties.NAME;
    if (visitedCountries.includes(countryName)) {
      return 'rgba(59, 130, 246, 0.8)'; // Bright blue for visited
    }
    return hoverD === d ? 'rgba(100, 116, 139, 0.6)' : 'rgba(71, 85, 105, 0.4)';
  };

  const handlePolygonClick = (d: any) => {
    const countryName = d.properties.ADMIN || d.properties.NAME;
    if (countryName) {
      onCountryClick(countryName);
      const isVisited = visitedCountries.includes(countryName);
      toast.success(
        isVisited ? `${countryName} removed from visited list` : `${countryName} marked as visited!`
      );
    }
  };

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={countries.features}
      polygonAltitude={(d: any) => (hoverD === d ? 0.01 : 0.006)}
      polygonCapColor={getPolygonColor}
      polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
      polygonStrokeColor={() => '#111'}
      polygonLabel={({ properties }: any) => `
        <div style="
          background: rgba(0, 0, 0, 0.9);
          padding: 8px 12px;
          border-radius: 6px;
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          border: 1px solid rgba(59, 130, 246, 0.5);
        ">
          <strong>${properties.ADMIN || properties.NAME}</strong>
        </div>
      `}
      onPolygonHover={setHoverD}
      onPolygonClick={handlePolygonClick}
      atmosphereColor="#3b82f6"
      atmosphereAltitude={0.15}
    />
  );
};

export default GlobeComponent;
