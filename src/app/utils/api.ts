import axios, { CancelTokenSource } from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Track active requests to allow cancellation
let activePokemonRequestSource: CancelTokenSource | null = null;

export const cancelPreviousPokemonRequests = () => {
  if (activePokemonRequestSource) {
    activePokemonRequestSource.cancel('Operation canceled due to new request');
    activePokemonRequestSource = null;
  }
};

export const fetchPokemonList = async (limit = 20, offset = 0) => {
  cancelPreviousPokemonRequests();
  activePokemonRequestSource = axios.CancelToken.source();
  
  try {
    const response = await axios.get(`${BASE_URL}/pokemon`, {
      params: { limit, offset },
      cancelToken: activePokemonRequestSource.token
    });
    
    // Fetch additional details for each Pokemon
    const pokemonWithDetails = await Promise.all(
      response.data.results.map(async (pokemon: any) => {
        const detailResponse = await axios.get(pokemon.url);
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

export const fetchPokemonTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/type`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPokemonByType = async (type: string) => {
  cancelPreviousPokemonRequests();
  activePokemonRequestSource = axios.CancelToken.source();
  
  try {
    const response = await axios.get(`${BASE_URL}/type/${type}`, {
      cancelToken: activePokemonRequestSource.token
    });
    
    // Fetch additional details for each Pokemon
    const pokemonWithDetails = await Promise.all(
      response.data.pokemon.map(async (item: any) => {
        const detailResponse = await axios.get(item.pokemon.url);
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

export const searchPokemon = async (query: string) => {
  cancelPreviousPokemonRequests();
  activePokemonRequestSource = axios.CancelToken.source();
  
  try {
    // First get all Pokemon (limited to first 100 for performance)
    const response = await axios.get(`${BASE_URL}/pokemon`, {
      params: { limit: 100, offset: 0 },
      cancelToken: activePokemonRequestSource.token
    });
    
    // Filter by query
    const filteredResults = response.data.results.filter((pokemon: any) => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Fetch additional details
    const pokemonWithDetails = await Promise.all(
      filteredResults.map(async (pokemon: any) => {
        const detailResponse = await axios.get(pokemon.url);
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