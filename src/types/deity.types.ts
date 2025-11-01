/**
 * Deity Type Definitions
 *
 * Represents the structure of deity data from deities.json
 */

export interface Deity {
  name: string;
  name_sanskrit: string;
  element: string;
  role: string;
  attributes: string[];
  symbols: string[];
  color: string;
  hymn_count: number;
  primary_mandalas: number[];
  related_deities: string[];
  iconography: string;
  epithets: string[];
}

export interface DeitiesData {
  deities: Deity[];
}
