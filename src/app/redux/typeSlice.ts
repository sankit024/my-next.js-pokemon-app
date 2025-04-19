import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchPokemonTypes } from '../utils/api';

interface TypeState {
  types: { name: string; url: string }[];
  activeType: string;
  loading: boolean;
  error: string | null;
}

const initialState: TypeState = {
  types: [],
  activeType: 'all',
  loading: false,
  error: null
};

export const fetchTypes = createAsyncThunk(
  'types/fetchAll',
  async () => {
    const response = await fetchPokemonTypes();
    return response;
  }
);

const typeSlice = createSlice({
  name: 'types',
  initialState,
  reducers: {
    setActiveType: (state, action: PayloadAction<string>) => {
      state.activeType = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload.results;
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch types';
      });
  }
});

export const { setActiveType } = typeSlice.actions;
export default typeSlice.reducer;