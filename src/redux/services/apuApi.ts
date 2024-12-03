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
    }),
});

export const { useApuByIdQuery } = apuApi;
