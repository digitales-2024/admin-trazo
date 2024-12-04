import { ApuBudget } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

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
    }),
});

export const { useCreateApuBudgetMutation } = apuBudgetApi;