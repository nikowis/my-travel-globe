import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { toast } from 'sonner';

interface GlobeComponentProps {
  visitedCountries: string[];
  onCountryClick: (country: string) => void;
  onCountriesLoaded?: (total: number) => void;
}

const GlobeComponent = ({ visitedCountries, onCountryClick, onCountriesLoaded }: GlobeComponentProps) => {
  const globeEl = useRef<any>();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState<any>(null);
  const [altitude, setAltitude] = useState(2.5);

  useEffect(() => {
    // Load country data
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        if (onCountriesLoaded) {
          onCountriesLoaded(data.features.length);
        }
      });
  }, [onCountriesLoaded]);

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate
      globeEl.current.controls().autoRotate = false;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      
      // Track camera altitude for showing labels when zoomed in
      const controls = globeEl.current.controls();
      const handleChange = () => {
        setAltitude(globeEl.current.camera().position.length());
      };
      controls.addEventListener('change', handleChange);
      return () => controls.removeEventListener('change', handleChange);
    }
  }, []);

  const getPolygonColor = (d: any) => {
    const countryName = d.properties.ADMIN || d.properties.NAME;
    if (visitedCountries.includes(countryName)) {
      return 'rgba(59, 130, 246, 0.8)'; // Bright blue for visited
    }
    return hoverD === d ? 'rgba(180, 180, 180, 0.7)' : 'rgba(200, 200, 200, 0.6)';
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

  // Calculate label data from countries
  const labelData = countries.features.map((d: any) => {
    const countryName = d.properties.ADMIN || d.properties.NAME;
    // Calculate center point from bbox
    const bbox = d.bbox || [0, 0, 0, 0];
    return {
      lat: (bbox[1] + bbox[3]) / 2,
      lng: (bbox[0] + bbox[2]) / 2,
      name: countryName,
    };
  });

  return (
    <Globe
      ref={globeEl}
      showGlobe={true}
      showAtmosphere={true}
      globeImageUrl=""
      backgroundColor="rgba(0,0,0,0)"
      polygonsData={countries.features}
      polygonAltitude={(d: any) => (hoverD === d ? 0.015 : 0.01)}
      polygonCapColor={getPolygonColor}
      polygonSideColor={() => 'rgba(0, 0, 0, 0.8)'}
      polygonStrokeColor={() => '#000'}
      onPolygonHover={setHoverD}
      onPolygonClick={handlePolygonClick}
      atmosphereColor="#3b82f6"
      atmosphereAltitude={0.15}
      labelsData={altitude < 2.5 ? labelData : []}
      labelLat={(d: any) => d.lat}
      labelLng={(d: any) => d.lng}
      labelText={(d: any) => d.name}
      labelSize={1.2}
      labelDotRadius={0}
      labelColor={() => 'rgba(255, 255, 255, 0.95)'}
      labelResolution={3}
      labelAltitude={0.015}
    />
  );
};

export default GlobeComponent;
