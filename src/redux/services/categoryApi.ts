import { Category, FullCategory } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

interface GetCategoryByIdProps {
    id: string;
}

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Category"],
    endpoints: (build) => ({
        //Crear categorias
        createCategory: build.mutation<Category, Partial<Category>>({
            query: (body) => ({
                url: "/category",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Category"],
        }),
        //Actualizar categorias
        updateCategory: build.mutation<
            Category,
            Partial<Category> & { id: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/category/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Category"],
        }),
        //Obtener categoria por id
        getCategoryById: build.query<Category, GetCategoryByIdProps>({
            query: ({ id }) => ({
                url: `/category/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Category"],
        }),
        //Obtener todos las categorias
        getAllCategory: build.query<Category[], void>({
            query: () => ({
                url: "/category",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Category"],
        }),
        //Eliminar categorias
        deleteCategory: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/category/remove/all`,
                method: "DELETE",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Category"],
        }),
        //Activar categorias
        reactivateCategory: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/category/reactivate/all`,
                method: "PATCH",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Category"],
        }),
        // Data completa de todas las categorías, subcategorías, partidas y subpartidas
        getFullCategory: build.query<FullCategory[], void>({
            query: () => ({
                url: "/category/all",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Category"],
        }),
    }),
});

export const {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useGetCategoryByIdQuery,
    useGetAllCategoryQuery,
    useDeleteCategoryMutation,
    useReactivateCategoryMutation,
    useGetFullCategoryQuery,
} = categoryApi;
