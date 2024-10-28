import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { adminApi } from "./services/adminApi";
import { authApi } from "./services/authApi";
import { businessApi } from "./services/businessApi";
import { clientsApi } from "./services/clientApi";
import { rolesApi } from "./services/rolesApi";
import { usersApi } from "./services/usersApi";
import { spacesApi } from "./services/spaceApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [businessApi.reducerPath]: businessApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [rolesApi.reducerPath]: rolesApi.reducer,
        [spacesApi.reducerPath]: spacesApi.reducer,
        [clientsApi.reducerPath]: clientsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(adminApi.middleware)
            .concat(businessApi.middleware)
            .concat(rolesApi.middleware)
            .concat(usersApi.middleware)
            .concat(spacesApi.middleware)
            .concat(clientsApi.middleware),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
