import { Quotation } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const quotationsApi = createApi({
    reducerPath: "quotationsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Quotation"],
    endpoints: (build) => ({
        //Obtener todos los cotizaciones
        getAllQuotations: build.query<Quotation[], void>({
            query: () => ({
                url: "/clients",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Quotation"],
        }),
    }),
});

export const { useGetAllQuotationsQuery } = quotationsApi;
