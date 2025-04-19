import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './pokemonSlice';
import typeReducer from './typeSlice';

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    types: typeReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;