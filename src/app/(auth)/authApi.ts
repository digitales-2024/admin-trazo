import baseQueryWithReauth from "@/redux/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

import { UserLoginOutput, UserLoginInput } from "./types";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Auth"],
    endpoints: (build) => ({
        login: build.mutation<UserLoginOutput, UserLoginInput>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
            async onQueryStarted(_args, { /*dispatch,*/ queryFulfilled }) {
                try {
                    await queryFulfilled;
                    /*
                    dispatch(adminApi.endpoints.profile.initiate(undefined, {
                        forceRefetch: true,
                    }));
                    */
                } catch (error) {
                    console.error(error);
                }
            },
            invalidatesTags: ["Auth"],
        }),

        logout: build.mutation<{ message: string; statusCode: number }, null>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["Auth"],
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
