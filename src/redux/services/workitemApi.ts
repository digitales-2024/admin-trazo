import { WorkItemCreate } from "@/types/workitem";
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
        // crear una partida y su APU
        createWorkItem: build.mutation<WorkItemCreate, WorkItemCreate>({
            query: (body) => ({
                url: "/work-item",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["WorkItem"],
        }),
    }),
});

export const { useGetWorkitemQuery, useCreateWorkItemMutation } = workitemApi;
