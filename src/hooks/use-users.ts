import { useGetUsersQuery } from "@/redux/services/usersApi";

export const useUsers = () => {
    const {
        data: users = [],
        error,
        isLoading,
        isFetching,
        refetch,
    } = useGetUsersQuery(undefined);

    return {
        users,
        error,
        isLoading,
        isFetching,
        refetch,
        totalUsers: users.length,
        getUser: (id: string) => users.find((user) => user.id === id),
    };
};
