import { QuotationSummary } from "@/types";
import {
    DesignProjectCreate,
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
        // Obtener las cotizaciones que se pueden utilizar para crear un proyecto de diseño:
        // Cotizaciones aprobadas, y no vinculadas a otro proyecto de diseño
        getCreatableQuotations: build.query<Array<QuotationSummary>, void>({
            query: () => ({
                url: "/design-project/quotation-for-create",
                method: "GET",
                credentials: "include",
            }),
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
        }),
    }),
});

export const {
    useGetDesignProjectsQuery,
    useGetCreatableQuotationsQuery,
    useCreateDesignProjectMutation,
} = designProjectApi;
