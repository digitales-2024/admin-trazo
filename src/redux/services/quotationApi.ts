import { Quotation, QuotationStructure } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const quotationsApi = createApi({
    reducerPath: "quotationsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Quotation"],
    endpoints: (build) => ({
        //Crear clientes
        createQuotation: build.mutation<
            QuotationStructure,
            Partial<QuotationStructure>
        >({
            query: (body) => ({
                url: "/quotation",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Quotation"],
        }),
        //Obtener todos los cotizaciones
        getAllQuotations: build.query<Quotation[], void>({
            query: () => ({
                url: "/quotation",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Quotation"],
        }),
    }),
});

export const { useGetAllQuotationsQuery, useCreateQuotationMutation } =
    quotationsApi;
