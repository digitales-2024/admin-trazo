import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const workitemApi = createApi({
    reducerPath: "workitemApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["WorkItem"],
    endpoints: (build) => ({
        // Obtener todas las partidas y subpartidas
        getWorkitem: build.query<Array<any>, void>({
            query: () => ({
                url: "/work-item",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["WorkItem"],
        }),
    }),
});

export const { useGetWorkitemQuery } = workitemApi;
