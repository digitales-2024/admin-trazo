import { Subcategory } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

interface GetSubcategoryByIdProps {
    id: string;
}

export const subcategoryApi = createApi({
    reducerPath: "subcategoryApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Subcategory"],
    endpoints: (build) => ({
        //Crear subcategorias
        createSubcategory: build.mutation<Subcategory, Partial<Subcategory>>({
            query: (body) => ({
                url: "/subcategory",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Subcategory"],
        }),
        //Actualizar subcategorias
        updateSubcategory: build.mutation<
            Subcategory,
            Partial<Subcategory> & { id: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/subcategory/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["Subcategory"],
        }),
        //Obtener subcategoria por id
        getSubcategoryById: build.query<Subcategory, GetSubcategoryByIdProps>({
            query: ({ id }) => ({
                url: `/subcategory/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Subcategory"],
        }),

        //Obtener todas las subcategorias de una categoria
        getSubcategoryByIdCategory: build.query<
            Subcategory,
            GetSubcategoryByIdProps
        >({
            query: ({ id }) => ({
                url: `/subcategory/category/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Subcategory"],
        }),

        //Obtener todos los subcategorias
        getAllSubcategory: build.query<Subcategory[], void>({
            query: () => ({
                url: "/subcategory",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Subcategory"],
        }),
        //Eliminar subcategorias
        deleteSubcategory: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/subcategory/remove/all`,
                method: "DELETE",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Subcategory"],
        }),
        //Activar subcategorias
        reactivateSubcategory: build.mutation<void, { ids: string[] }>({
            query: (ids) => ({
                url: `/subcategory/reactivate/all`,
                method: "PATCH",
                body: ids,
                credentials: "include",
            }),
            invalidatesTags: ["Subcategory"],
        }),
    }),
});

export const {
    useCreateSubcategoryMutation,
    useUpdateSubcategoryMutation,
    useGetSubcategoryByIdQuery,
    useGetAllSubcategoryQuery,
    useDeleteSubcategoryMutation,
    useReactivateSubcategoryMutation,
    useGetSubcategoryByIdCategoryQuery,
} = subcategoryApi;
