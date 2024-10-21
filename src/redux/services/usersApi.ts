import { User } from "@/types/user";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

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
        //Eliminar(desactivar) a un usuario
        deleteUser: build.mutation<User, string>({
            query: (id) => ({
                url: `users/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),
        //Reactivar a un usuario
        reactivateUser: build.mutation<User, string>({
            query: (id) => ({
                url: `users/reactivate/${id}`,
                method: "PATCH",
                credentials: "include",
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useDeleteUserMutation,
    useReactivateUserMutation,
} = usersApi;
