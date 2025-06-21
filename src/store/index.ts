import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { campaignsApi } from './campaignsApi';
import { participationsApi } from './participationsApi';

export const store = configureStore({
  reducer: {
    // Ajouter les reducers des API slices
    [campaignsApi.reducerPath]: campaignsApi.reducer,
    [participationsApi.reducerPath]: participationsApi.reducer,
  },
  // Ajouter les middlewares pour RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(campaignsApi.middleware)
      .concat(participationsApi.middleware),
});

// Activer les listeners pour le refetching automatique
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
