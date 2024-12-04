import { SubWorkItemCreate, SubWorkItemEdit } from "@/types/subworkitem";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const subworkitemApi = createApi({
    reducerPath: "subworkitemApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["SubWorkItem"],
    endpoints: (build) => ({
        // crear una partida y su APU
        createSubWorkItem: build.mutation<SubWorkItemCreate, SubWorkItemCreate>(
            {
                query: (body) => ({
                    url: "/sub-work-item",
                    method: "POST",
                    body,
                    credentials: "include",
                }),
                invalidatesTags: ["SubWorkItem"],
            },
        ),
        // editar partida
        editSubWorkItem: build.mutation<
            void,
            { body: SubWorkItemEdit; id: string }
        >({
            query: ({ body, id }) => ({
                url: `/sub-work-item/${id}`,
                method: "PATCH",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["SubWorkItem"],
        }),
    }),
});

export const { useCreateSubWorkItemMutation, useEditSubWorkItemMutation } =
    subworkitemApi;
