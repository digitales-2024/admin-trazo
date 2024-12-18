import { ApuReturnNested } from "@/types/apu";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";
import { ApuBudgetResponse } from "./apuBudgetApi";
interface GetApuByIdProps {
    id: string;
}

export const apuApi = createApi({
    reducerPath: "apuApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Apu"],
    endpoints: (build) => ({
        apuById: build.query<ApuReturnNested, GetApuByIdProps>({
            query: ({ id }) => ({
                url: `/apus/${id}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        updateApu: build.mutation<ApuBudgetResponse, { id: string }>({
            query: ({ id, ...body }) => ({
                url: `/apus/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Apu"],
        }),
    }),
});

export const { useApuByIdQuery, useUpdateApuMutation } = apuApi;
