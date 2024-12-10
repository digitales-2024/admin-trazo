import { ApuReturnNested } from "@/types/apu";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const apuApi = createApi({
    reducerPath: "apuApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Apu"],
    endpoints: (build) => ({
        apuById: build.query<ApuReturnNested, string>({
            query: (id: string) => ({
                url: `/apus/${id}`,
            }),
        }),
        updateApu: build.mutation<void, { id: string }>({
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
