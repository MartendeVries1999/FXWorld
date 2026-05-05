// Maps ISO 3166-1 numeric codes (as strings, used by world-atlas TopoJSON)
// to ISO 3166-1 alpha-3 codes.
// Only includes countries we have currency data for.
export const numericToAlpha3: Record<string, string> = {
  '004': 'AFG', '008': 'ALB', '012': 'DZA', '032': 'ARG', '036': 'AUS',
  '040': 'AUT', '048': 'BHR', '050': 'BGD', '056': 'BEL', '076': 'BRA',
  '100': 'BGR', '124': 'CAN', '152': 'CHL', '156': 'CHN', '170': 'COL',
  '191': 'HRV', '196': 'CYP', '203': 'CZE', '208': 'DNK', '233': 'EST',
  '246': 'FIN', '250': 'FRA', '276': 'DEU', '300': 'GRC', '344': 'HKG',
  '348': 'HUN', '352': 'ISL', '356': 'IND', '360': 'IDN', '372': 'IRL',
  '376': 'ISR', '380': 'ITA', '392': 'JPN', '410': 'KOR', '428': 'LVA',
  '440': 'LTU', '442': 'LUX', '458': 'MYS', '470': 'MLT', '484': 'MEX',
  '528': 'NLD', '554': 'NZL', '578': 'NOR', '608': 'PHL', '616': 'POL',
  '620': 'PRT', '642': 'ROU', '643': 'RUS', '702': 'SGP', '703': 'SVK',
  '705': 'SVN', '710': 'ZAF', '724': 'ESP', '752': 'SWE', '756': 'CHE',
  '764': 'THA', '792': 'TUR', '826': 'GBR', '840': 'USA',
};