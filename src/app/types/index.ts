export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites?: {
    front_default: string;
    front_shiny?: string;
    back_default?: string;
    back_shiny?: string;
    other?: {
      'official-artwork'?: {
        front_default?: string;
      }
    }
  };
  types?: PokemonType[];
  abilities?: PokemonAbility[];
  stats?: PokemonStat[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
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