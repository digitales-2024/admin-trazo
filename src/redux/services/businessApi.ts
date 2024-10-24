import { createApi } from "@reduxjs/toolkit/query";

import baseQueryWithReauth from "../baseQuery";

export const businessApi = createApi({
    reducerPath: "businessApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Business"],
    endpoints: (build) => ({
        // obtener todos los business
        getBusiness: build.query({
            query: () => ({
                url: "/business",
                credentials: "include",
            }),
            providesTags: ["Business"],
        }),
        // Actualizar un business por id
        updateBusiness: build.mutation({
            query: ({ id, ...body }) => ({
                url: `business/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Business"],
        }),
    }),
});
