import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { adminApi } from "./services/adminApi";
import { apuBudgetApi } from "./services/apuBudgetApi";
import { apuApi } from "./services/apuApi";
import { authApi } from "./services/authApi";
import { budgetsApi } from "./services/budgetApi";
import { businessApi } from "./services/businessApi";
import { categoryApi } from "./services/categoryApi";
import { clientsApi } from "./services/clientApi";
import { designProjectApi } from "./services/designProjectApi";
import { exchangeRateSunatApi } from "./services/exchangeRateSunatApi";
import { observationApi } from "./services/observationApi";
import { projectCharterApi } from "./services/projectCharterApi";
import { quotationsApi } from "./services/quotationApi";
import { resourceApi } from "./services/resourceApi";
import { rolesApi } from "./services/rolesApi";
import { spacesApi } from "./services/spaceApi";
import { subcategoryApi } from "./services/subcategoryApi";
import { subworkitemApi } from "./services/subworkitemApi";
import { usersApi } from "./services/usersApi";
import { workitemApi } from "./services/workitemApi";
import { zoningApi } from "./services/zoningApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [apuApi.reducerPath]: apuApi.reducer,
        [businessApi.reducerPath]: businessApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [designProjectApi.reducerPath]: designProjectApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [rolesApi.reducerPath]: rolesApi.reducer,
        [spacesApi.reducerPath]: spacesApi.reducer,
        [clientsApi.reducerPath]: clientsApi.reducer,
        [quotationsApi.reducerPath]: quotationsApi.reducer,
        [exchangeRateSunatApi.reducerPath]: exchangeRateSunatApi.reducer,
        [zoningApi.reducerPath]: zoningApi.reducer,
        [projectCharterApi.reducerPath]: projectCharterApi.reducer,
        [observationApi.reducerPath]: observationApi.reducer,
        [resourceApi.reducerPath]: resourceApi.reducer,
        [budgetsApi.reducerPath]: budgetsApi.reducer,
        [subcategoryApi.reducerPath]: subcategoryApi.reducer,
        [workitemApi.reducerPath]: workitemApi.reducer,
        [apuBudgetApi.reducerPath]: apuBudgetApi.reducer,
        [subworkitemApi.reducerPath]: subworkitemApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Configuración para evitar errores de "non-serializable value"
            serializableCheck: {
                // Ignorar las acciones que no son serializables, específicamente de classApi
                ignoredActions: [
                    "quotationsApi/executeMutation/fulfilled",
                    "quotationsApi/executeMutation/rejected",
                    "observationApi/executeMutation/fulfilled",
                    "observationApi/executeMutation/rejected",
                    "designProjectApi/executeMutation/fulfilled",
                    "designProjectApi/executeMutation/rejected",
                ],
                // Ignorar las rutas en el estado que contienen valores no serializables
                ignoredPaths: [
                    "quotationsApi.mutations",
                    "designProjectApi.mutations",
                    "observationApi.mutations",
                ],
            },
        })
            .concat(authApi.middleware)
            .concat(adminApi.middleware)
            .concat(apuApi.middleware)
            .concat(businessApi.middleware)
            .concat(categoryApi.middleware)
            .concat(designProjectApi.middleware)
            .concat(rolesApi.middleware)
            .concat(usersApi.middleware)
            .concat(spacesApi.middleware)
            .concat(clientsApi.middleware)
            .concat(quotationsApi.middleware)
            .concat(exchangeRateSunatApi.middleware)
            .concat(zoningApi.middleware)
            .concat(projectCharterApi.middleware)
            .concat(observationApi.middleware)
            .concat(resourceApi.middleware)
            .concat(workitemApi.middleware)
            .concat(subworkitemApi.middleware)
            .concat(budgetsApi.middleware)
            .concat(categoryApi.middleware)
            .concat(subcategoryApi.middleware)
            .concat(apuBudgetApi.middleware),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
