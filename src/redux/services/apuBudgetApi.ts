import { ApuBudget } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

interface GetApuBudgetsByIdProps {
    id: string;
}

export const apuBudgetApi = createApi({
    reducerPath: "apuBudgetApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["ApuBudget"],
    endpoints: (build) => ({
        // Crear una variante de apu en ApuBudget
        createApuBudget: build.mutation<ApuBudget, Partial<ApuBudget>>({
            query: (body) => ({
                url: "/apu-budget",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["ApuBudget"],
        }),
        // Obtener apu por id en ApuBudget
        getApuBudgetById: build.query<ApuBudget, GetApuBudgetsByIdProps>({
            query: ({ id }) => ({
                url: `/apu-budget/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["ApuBudget"],
        }),
        //Actualizar presupuesto
        updateApuBudget: build.mutation<
            ApuBudget,
            Partial<ApuBudget> & { id: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/apu-budget/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["ApuBudget"],
        }),
    }),
});

export const {
    useCreateApuBudgetMutation,
    useGetApuBudgetByIdQuery,
    useUpdateApuBudgetMutation,
} = apuBudgetApi;
