'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { COUNTRY_BY_CODE } from '@/lib/countries';
import { numericToAlpha3 } from '@/lib/iso-codes';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const GEO_URL = '//unpkg.com/world-atlas/countries-110m.json';

type Props = {
  selectedCode: string | null;
  onSelect: (countryCode: string) => void;
  baseCurrency: string;
};

export function WorldMap({ selectedCode, onSelect, baseCurrency }: Props) {
  const globeRef = useRef<any>(null);
  const [polygons, setPolygons] = useState<any[]>([]);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 800, height: 800 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Load and convert TopoJSON to GeoJSON polygons
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [topojsonClient, res] = await Promise.all([
        import('topojson-client'),
        fetch(GEO_URL),
      ]);
      const topo = await res.json();
      const geo: any = topojsonClient.feature(topo, topo.objects.countries);
      if (!cancelled) setPolygons(geo.features);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Responsive sizing — globe diameter equals the smaller of width/height
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const diameter = Math.min(width, height);
      setSize({ width: diameter, height: diameter });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Smoothly rotate to selected country
  useEffect(() => {
    if (!selectedCode || !globeRef.current) return;
    const country = COUNTRY_BY_CODE.get(selectedCode);
    if (!country) return;
    globeRef.current.pointOfView(
      { lat: country.lat, lng: country.lng, altitude: 1.8 },
      1200
    );
  }, [selectedCode]);

  // Initial controls setup
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = false;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.rotateSpeed = 0.4;
      // On touch devices, require two-finger gesture to rotate, freeing one-finger swipes for page scroll
      controls.touches = {
        ONE: 0,    // 0 = no action on single touch
        TWO: 2,    // 2 = ROTATE on two-finger touch
      };
    }
  }, [polygons.length]);

  // Helpers
  const codeForFeature = (feat: any): string | null => {
    const numericId = String(feat.id).padStart(3, '0');
    return numericToAlpha3[numericId] ?? null;
  };

  const isSupported = (feat: any) => {
    const code = codeForFeature(feat);
    return (
      code !== null &&
      COUNTRY_BY_CODE.has(code) &&
      COUNTRY_BY_CODE.get(code)!.currency !== baseCurrency
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
    >
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        showGlobe={true}
        showAtmosphere={true}
        atmosphereColor="hsl(210, 80%, 60%)"
        atmosphereAltitude={0.18}
        globeImageUrl="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='2'%3E%3Crect width='4' height='2' fill='%231a4570'/%3E%3C/svg%3E"
        polygonsData={polygons}
        polygonAltitude={(d: any) => {
          const code = codeForFeature(d);
          const featCountry = code ? COUNTRY_BY_CODE.get(code) : null;
          if (code === selectedCode) return 0.015;
          if (code === hoveredCode) return 0.012;
          if (featCountry?.currency === baseCurrency) return 0.011;
          return 0.008;
        }}
        polygonCapColor={(d: any) => {
          const code = codeForFeature(d);
          if (!code) return 'hsl(220, 12%, 38%)';
          const featCountry = COUNTRY_BY_CODE.get(code);

          if (code === selectedCode) return 'hsl(210, 100%, 65%)';
          if (code === hoveredCode && isSupported(d)) return 'hsl(210, 95%, 60%)';
          if (featCountry?.currency === baseCurrency) return 'hsl(40, 80%, 55%)';
          if (isSupported(d)) return 'hsl(215, 25%, 55%)';
          return 'hsl(220, 12%, 38%)';
        }}
        polygonSideColor={() => 'hsl(220, 25%, 15%)'}
        polygonStrokeColor={() => 'hsl(220, 20%, 30%)'}
        polygonLabel={(d: any) => {
          const code = codeForFeature(d);
          if (!code || !COUNTRY_BY_CODE.has(code)) return '';
          const country = COUNTRY_BY_CODE.get(code)!;
          if (country.currency === baseCurrency) return '';
          return `<div style="background: rgba(10, 14, 25, 0.95); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 6px; padding: 8px 12px; font-family: Inter, system-ui, sans-serif; color: white; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
            <div style="font-size: 13px; font-weight: 500;">${country.name.replace(/\s*\(EUR\)/, '')}</div>
            <div style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 3px; font-family: 'JetBrains Mono', monospace;">${baseCurrency} → ${country.currency}</div>
          </div>`;
        }}
        onPolygonHover={(polygon: any) => {
          if (!polygon) {
            setHoveredCode(null);
            document.body.style.cursor = 'default';
            return;
          }
          const code = codeForFeature(polygon);
          if (code && isSupported(polygon)) {
            setHoveredCode(code);
            document.body.style.cursor = 'pointer';
          } else {
            setHoveredCode(null);
            document.body.style.cursor = 'default';
          }
        }}
        onPolygonClick={(polygon: any) => {
          const code = codeForFeature(polygon);
          if (code && isSupported(polygon)) {
            onSelect(code);
          }
        }}
        polygonsTransitionDuration={300}
      />
    </div>
  );
}