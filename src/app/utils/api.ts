import axios, { CancelTokenSource } from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Define interfaces for API responses
interface PokemonSprites {
  front_default: string;
  back_default: string;
  front_shiny?: string;
  back_shiny?: string;
  other?: {
    'official-artwork'?: {
      front_default?: string;
    };
  };
}

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonDetail extends PokemonListItem {
  id: number;
  sprites: PokemonSprites;
  types: PokemonType[];
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

interface PokemonListResponseWithDetails {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonDetail[];
}

interface TypePokemon {
  pokemon: PokemonListItem;
  slot: number;
}

interface TypeResponse {
  id: number;
  name: string;
  pokemon: TypePokemon[];
}

interface TypesListResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}

// Track active requests to allow cancellation
let activePokemonRequestSource: CancelTokenSource | null = null;

export const cancelPreviousPokemonRequests = () => {
  if (activePokemonRequestSource) {
    activePokemonRequestSource.cancel('Operation canceled due to new request');
    activePokemonRequestSource = null;
  }
};

export const fetchPokemonList = async (limit = 20, offset = 0): Promise<PokemonListResponseWithDetails | undefined> => {
  cancelPreviousPokemonRequests();
  activePokemonRequestSource = axios.CancelToken.source();
  
  try {
    const response = await axios.get<PokemonListResponse>(`${BASE_URL}/pokemon`, {
      params: { limit, offset },
      cancelToken: activePokemonRequestSource.token
    });
    
    // Fetch additional details for each Pokemon
    const pokemonWithDetails = await Promise.all(
      response.data.results.map(async (pokemon: PokemonListItem) => {
        const detailResponse = await axios.get<PokemonDetail>(pokemon.url);
        return {
          ...pokemon,
          id: detailResponse.data.id,
          sprites: detailResponse.data.sprites,
          types: detailResponse.data.types
        };
      })
    );
    
    return {
      ...response.data,
      results: pokemonWithDetails
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      throw error;
    }
  }
};

export const fetchPokemonTypes = async (): Promise<TypesListResponse> => {
  try {
    const response = await axios.get<TypesListResponse>(`${BASE_URL}/type`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPokemonByType = async (type: string): Promise<PokemonDetail[] | undefined> => {
  cancelPreviousPokemonRequests();
  activePokemonRequestSource = axios.CancelToken.source();
  
  try {
    const response = await axios.get<TypeResponse>(`${BASE_URL}/type/${type}`, {
      cancelToken: activePokemonRequestSource.token
    });
    
    // Fetch additional details for each Pokemon
    const pokemonWithDetails = await Promise.all(
      response.data.pokemon.map(async (item: TypePokemon) => {
        const detailResponse = await axios.get<PokemonDetail>(item.pokemon.url);
        return {
          ...item.pokemon,
          id: detailResponse.data.id,
          sprites: detailResponse.data.sprites,
          types: detailResponse.data.types
        };
      })
    );
    
    return pokemonWithDetails;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      throw error;
    }
  }
};

export const searchPokemon = async (query: string): Promise<PokemonDetail[] | undefined> => {
  cancelPreviousPokemonRequests();
  activePokemonRequestSource = axios.CancelToken.source();
  
  try {
    // First try to search for an exact match by name
    try {
      const exactMatchResponse = await axios.get<PokemonDetail>(`${BASE_URL}/pokemon/${query.toLowerCase()}`, {
        cancelToken: activePokemonRequestSource.token
      });
      
      // If successful, return as a single result
      return [{
        name: exactMatchResponse.data.name,
        id: exactMatchResponse.data.id,
        url: `${BASE_URL}/pokemon/${exactMatchResponse.data.id}`,
        sprites: exactMatchResponse.data.sprites,
        types: exactMatchResponse.data.types
      }];
    } catch  {
      // If no exact match, continue with broader search
    }
    
    // Get a larger set of Pokemon (increased from 100 to 250 for better search results)
    const response = await axios.get<PokemonListResponse>(`${BASE_URL}/pokemon`, {
      params: { limit: 250, offset: 0 },
      cancelToken: activePokemonRequestSource.token
    });
    
    // Filter by query
    const filteredResults = response.data.results.filter((pokemon: PokemonListItem) => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Fetch additional details
    const pokemonWithDetails = await Promise.all(
      filteredResults.map(async (pokemon: PokemonListItem) => {
        const detailResponse = await axios.get<PokemonDetail>(pokemon.url);
        return {
          ...pokemon,
          id: detailResponse.data.id,
          sprites: detailResponse.data.sprites,
          types: detailResponse.data.types
        };
      })
    );
    
    return pokemonWithDetails;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      throw error;
    }
  }
};