import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";
import { DesignProjectSummaryData } from "@/types/designProject";

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
    }),
})

export const {
    useGetDesignProjectsQuery,
} = designProjectApi;
