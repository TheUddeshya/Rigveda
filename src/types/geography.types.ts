/**
 * Geography Type Definitions
 *
 * Represents the structure of geographical data from regions.json
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Region {
  name: string;
  name_sanskrit: string;
  modern_location: string;
  coordinates: Coordinates;
  references: string[];
  significance: string;
  notes?: string;
}

export interface RegionsData {
  regions: Region[];
}
