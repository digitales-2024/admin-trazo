import { User } from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "./baseQuery";

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Users"],
    endpoints: (build) => ({
        // Obtener los usuarios
        getUsers: build.query<User[], undefined>({
            query: () => ({
                url: "users",
                credentials: "include",
            }),
            providesTags: ["Users"],
        }),
    }),
});

export const { useGetUsersQuery } = usersApi;
