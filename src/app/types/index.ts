export interface Pokemon {
    id: number;
    name: string;
    url: string;
    sprites?: {
      front_default: string;
    };
    types?: PokemonType[];
  }
  
  export interface PokemonType {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }
  
  export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Pokemon[];
  }
  
  export interface TypeListResponse {
    count: number;
    results: {
      name: string;
      url: string;
    }[];
  }
  
  export interface TypeDetailResponse {
    pokemon: {
      pokemon: Pokemon;
      slot: number;
    }[];
  }