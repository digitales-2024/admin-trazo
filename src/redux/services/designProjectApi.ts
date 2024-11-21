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
    }),
});

export const { useGetDesignProjectsQuery, useCreateDesignProjectMutation } =
    designProjectApi;
