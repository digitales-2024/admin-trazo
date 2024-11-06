import {
    Quotation,
    QuotationStatusType,
    QuotationStructure,
    QuotationSummary,
} from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

interface GetQuotationsByIdProps {
    id: string;
}

export const quotationsApi = createApi({
    reducerPath: "quotationsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Quotation"],
    endpoints: (build) => ({
        // Crear cotización
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
        // Obtener todos los cotizaciones
        getAllQuotations: build.query<QuotationSummary[], void>({
            query: () => ({
                url: "/quotation",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Quotation"],
        }),
        // Actualizar el estado de una cotización
        updateStatusQuotation: build.mutation<
            Quotation,
            { id: string; newStatus: QuotationStatusType }
        >({
            query: ({ id, newStatus }) => ({
                url: `/quotation/${id}/status`,
                method: "PATCH",
                body: { newStatus },
                credentials: "include",
            }),
            invalidatesTags: ["Quotation"],
        }),
        // Generar Pdf cotización
        genPdfQuotation: build.mutation<Blob, string>({
            query: (id) => ({
                url: `/quotation/${id}/pdf`,
                method: "GET",
                responseHandler: (response: Response) => response.blob(),
                credentials: "include",
            }),
        }),
        // Obtener cotización por id
        getQuotationById: build.query<Quotation, GetQuotationsByIdProps>({
            query: ({ id }) => ({
                url: `/quotation/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Quotation"],
        }),
        //Actualizar clientes
        updateClient: build.mutation<
            Quotation,
            Partial<Quotation> & { id: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/quotation/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Quotation"],
        }),
    }),
});

export const {
    useGetAllQuotationsQuery,
    useCreateQuotationMutation,
    useUpdateStatusQuotationMutation,
    useGenPdfQuotationMutation,
    useGetQuotationByIdQuery,
    useUpdateClientMutation,
} = quotationsApi;
