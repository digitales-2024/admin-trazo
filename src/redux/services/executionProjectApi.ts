import { ExecutionProject, ExecutionProjectStatusType } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const executionProjectApi = createApi({
    reducerPath: "executionProjectApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Execution Projects"],
    endpoints: (build) => ({
        // Crear proyecto de ejecución
        createExecutionProject: build.mutation<
            ExecutionProject,
            Partial<ExecutionProject>
        >({
            query: (body) => ({
                url: "/execution-project",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Execution Projects"],
        }),
        // Obtener todos los proyectos de ejecución
        getAllExecutionProjects: build.query<ExecutionProject[], void>({
            query: () => ({
                url: "/execution-project",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Execution Projects"],
        }),
        // Actualizar el estado de un proyecto de ejecución
        updateStatusExecutionProject: build.mutation<
            void,
            { body: ExecutionProjectStatusType; id: string }
        >({
            query: ({ body, id }) => ({
                url: `/execution-project/${id}/status`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Execution Projects"],
        }),
        //Actualizar proyecto de ejecución
        updateExecutionProject: build.mutation<
            ExecutionProject,
            Partial<ExecutionProject> & { id: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/execution-project/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Execution Projects"],
        }),
    }),
});

export const {
    useCreateExecutionProjectMutation,
    useGetAllExecutionProjectsQuery,
    useUpdateStatusExecutionProjectMutation,
    useUpdateExecutionProjectMutation,
} = executionProjectApi;
