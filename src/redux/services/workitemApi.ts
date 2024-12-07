import { WorkItemCreate, WorkItemEdit, WorkItemGetAll } from "@/types/workitem";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const workitemApi = createApi({
    reducerPath: "workitemApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["WorkItem"],
    endpoints: (build) => ({
        // Obtener todas las partidas y subpartidas
        getWorkitem: build.query<Array<WorkItemGetAll>, void>({
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

        // editar partida
        editWorkItem: build.mutation<void, { body: WorkItemEdit; id: string }>({
            query: ({ body, id }) => ({
                url: `/work-item/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["WorkItem"],
        }),
        // eliminar partida y todos sus hijos
        deleteWorkItem: build.mutation<void, string>({
            query: (id) => ({
                url: `/work-item/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["WorkItem"],
        }),
        // reactivar partida
        reactivateWorkItem: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/work-item/reactivate/all`,
                method: "PATCH",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["WorkItem"],
        }),
    }),
});

export const {
    useGetWorkitemQuery,
    useCreateWorkItemMutation,
    useEditWorkItemMutation,
    useDeleteWorkItemMutation,
    useReactivateWorkItemMutation,
} = workitemApi;
