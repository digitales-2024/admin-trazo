import { CategoryGet } from "@/types/category";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Category"],
    endpoints: (build) => ({
        // Obtener categorias, subcategorias, partidas y subpartidas
        nestedCategory: build.query<Array<CategoryGet>, void>({
            query: () => ({
                url: `/category/category/all`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Category"],
        }),
    }),
});

export const { useNestedCategoryQuery } = categoryApi;
