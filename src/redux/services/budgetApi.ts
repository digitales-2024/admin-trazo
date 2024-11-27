import { createApi } from "@reduxjs/toolkit/query/react";

import { Budget, BudgetStatusType, BudgetSummary } from "../../types";
import baseQueryWithReauth from "../baseQuery";

interface GetBudgetsByIdProps {
    id: string;
}

export const budgetsApi = createApi({
    reducerPath: "budgetsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Budget"],
    endpoints: (build) => ({
        // Crear presupuesto
        createBudget: build.mutation<Budget, Partial<Budget>>({
            query: (body) => ({
                url: "/budget",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Budget"],
        }),
        // Obtener todos los presupuestos
        getAllBudgets: build.query<BudgetSummary[], void>({
            query: () => ({
                url: "/budget",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Budget"],
        }),
        // Actualizar el estado de un presupuesto
        updateStatusBudget: build.mutation<
            Budget,
            { id: string; newStatus: BudgetStatusType }
        >({
            query: ({ id, newStatus }) => ({
                url: `/budget/status/${id}`,
                method: "PATCH",
                body: { newStatus },
                credentials: "include",
            }),
            invalidatesTags: ["Budget"],
        }),
        // Obtener presupuesto por id
        getBudgetById: build.query<Budget, GetBudgetsByIdProps>({
            query: ({ id }) => ({
                url: `/budget/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Budget"],
        }),
        //Actualizar presupuesto
        updateBudget: build.mutation<Budget, Partial<Budget> & { id: string }>({
            query: ({ id, ...body }) => ({
                url: `/budget/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Budget"],
        }),
    }),
});

export const {
    useCreateBudgetMutation,
    useGetAllBudgetsQuery,
    useUpdateStatusBudgetMutation,
    useGetBudgetByIdQuery,
    useUpdateBudgetMutation,
} = budgetsApi;
