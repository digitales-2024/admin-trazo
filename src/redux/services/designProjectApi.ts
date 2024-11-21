import {
    DesignProjectCreate,
    DesignProjectData,
    DesignProjectSummaryData,
} from "@/types/designProject";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const designProjectApi = createApi({
    reducerPath: "designProjectApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["DesignProject"],
    endpoints: (build) => ({
        // Obtener todos los proyectos
        getDesignProjects: build.query<Array<DesignProjectSummaryData>, void>({
            query: () => ({
                url: "/design-project",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["DesignProject"],
        }),
        // Obtener proyecto por id
        getDesignProjectById: build.query<DesignProjectData, string>({
            query: (id) => ({
                url: `/design-project/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["DesignProject"],
        }),
        // Crea un projecto de diseño
        createDesignProject: build.mutation<
            DesignProjectCreate,
            DesignProjectCreate
        >({
            query: (body) => ({
                url: "/design-project",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["DesignProject"],
        }),
        // Generar Pdf del contrato
        genPdfContract: build.mutation<
            Blob,
            { id: string; signingDate: string }
        >({
            query: ({ id, signingDate }) => ({
                url: `/design-project/${id}/pdf`,
                method: "POST",
                body: {
                    signingDate,
                },
                responseHandler: (response: Response) => response.blob(),
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useGetDesignProjectsQuery,
    useGetDesignProjectByIdQuery,
    useCreateDesignProjectMutation,
    useGenPdfContractMutation,
} = designProjectApi;
