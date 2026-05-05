export type Country = {
  code: string;
  name: string;
  currency: string;
  lat: number;
  lng: number;
};

// Coordinates are the country's capital (or main city) — used to place markers on the globe.
export const COUNTRIES: Country[] = [
  // Eurozone — single marker (Brussels) since they share EUR
  { code: 'BEL', name: 'Belgium (EUR)', currency: 'EUR', lat: 50.85, lng: 4.35 },
  { code: 'DEU', name: 'Germany', currency: 'EUR', lat: 52.52, lng: 13.40 },
  { code: 'FRA', name: 'France', currency: 'EUR', lat: 48.85, lng: 2.35 },
  { code: 'ITA', name: 'Italy', currency: 'EUR', lat: 41.90, lng: 12.49 },
  { code: 'ESP', name: 'Spain', currency: 'EUR', lat: 40.41, lng: -3.70 },
  { code: 'NLD', name: 'Netherlands', currency: 'EUR', lat: 52.37, lng: 4.89 },
  { code: 'AUT', name: 'Austria', currency: 'EUR', lat: 48.20, lng: 16.37 },
  { code: 'PRT', name: 'Portugal', currency: 'EUR', lat: 38.72, lng: -9.13 },
  { code: 'GRC', name: 'Greece', currency: 'EUR', lat: 37.98, lng: 23.72 },
  { code: 'IRL', name: 'Ireland', currency: 'EUR', lat: 53.34, lng: -6.26 },
  { code: 'FIN', name: 'Finland', currency: 'EUR', lat: 60.17, lng: 24.94 },
  // Major economies
  { code: 'USA', name: 'United States', currency: 'USD', lat: 38.91, lng: -77.04 },
  { code: 'GBR', name: 'United Kingdom', currency: 'GBP', lat: 51.51, lng: -0.13 },
  { code: 'JPN', name: 'Japan', currency: 'JPY', lat: 35.68, lng: 139.69 },
  { code: 'CHE', name: 'Switzerland', currency: 'CHF', lat: 46.95, lng: 7.45 },
  { code: 'CAN', name: 'Canada', currency: 'CAD', lat: 45.42, lng: -75.70 },
  { code: 'AUS', name: 'Australia', currency: 'AUD', lat: -35.28, lng: 149.13 },
  { code: 'NZL', name: 'New Zealand', currency: 'NZD', lat: -41.29, lng: 174.78 },
  // Asia-Pacific
  { code: 'CHN', name: 'China', currency: 'CNY', lat: 39.90, lng: 116.41 },
  { code: 'HKG', name: 'Hong Kong', currency: 'HKD', lat: 22.32, lng: 114.17 },
  { code: 'SGP', name: 'Singapore', currency: 'SGD', lat: 1.35, lng: 103.82 },
  { code: 'KOR', name: 'South Korea', currency: 'KRW', lat: 37.57, lng: 126.98 },
  { code: 'IDN', name: 'Indonesia', currency: 'IDR', lat: -6.21, lng: 106.85 },
  { code: 'IND', name: 'India', currency: 'INR', lat: 28.61, lng: 77.21 },
  { code: 'THA', name: 'Thailand', currency: 'THB', lat: 13.76, lng: 100.50 },
  { code: 'MYS', name: 'Malaysia', currency: 'MYR', lat: 3.14, lng: 101.69 },
  { code: 'PHL', name: 'Philippines', currency: 'PHP', lat: 14.60, lng: 120.98 },
  // Nordics & Eastern Europe
  { code: 'SWE', name: 'Sweden', currency: 'SEK', lat: 59.33, lng: 18.07 },
  { code: 'NOR', name: 'Norway', currency: 'NOK', lat: 59.91, lng: 10.75 },
  { code: 'DNK', name: 'Denmark', currency: 'DKK', lat: 55.68, lng: 12.57 },
  { code: 'POL', name: 'Poland', currency: 'PLN', lat: 52.23, lng: 21.01 },
  { code: 'CZE', name: 'Czech Republic', currency: 'CZK', lat: 50.08, lng: 14.44 },
  { code: 'HUN', name: 'Hungary', currency: 'HUF', lat: 47.50, lng: 19.04 },
  { code: 'ROU', name: 'Romania', currency: 'RON', lat: 44.43, lng: 26.10 },
  { code: 'ISL', name: 'Iceland', currency: 'ISK', lat: 64.13, lng: -21.82 },
  // Other
  { code: 'TUR', name: 'Turkey', currency: 'TRY', lat: 39.93, lng: 32.86 },
  { code: 'ZAF', name: 'South Africa', currency: 'ZAR', lat: -25.75, lng: 28.19 },
  { code: 'MEX', name: 'Mexico', currency: 'MXN', lat: 19.43, lng: -99.13 },
  { code: 'BRA', name: 'Brazil', currency: 'BRL', lat: -15.79, lng: -47.88 },
  { code: 'ISR', name: 'Israel', currency: 'ILS', lat: 31.78, lng: 35.22 },
];

export const COUNTRY_BY_CODE = new Map(COUNTRIES.map(c => [c.code, c]));

export const BASE_CURRENCIES = Array.from(
  new Set(COUNTRIES.map(c => c.currency))
).sort();