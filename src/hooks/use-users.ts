import {
    useGetUsersQuery,
    useDeleteUserMutation,
    useReactivateUserMutation,
} from "@/redux/services/usersApi";
import { toast } from "sonner";

export const useUsers = () => {
    const {
        data: users = [],
        error,
        isLoading,
        isFetching,
        refetch,
    } = useGetUsersQuery(undefined);

    const [deleteUser, { isSuccess: isSuccessDeleteUser }] =
        useDeleteUserMutation();
    const [reactivateUser, { isSuccess: isSuccessReactivateUser }] =
        useReactivateUserMutation();
    const onDesactivateUser = async(id: string) => {
        const promise = async() => await deleteUser(id).unwrap();

        toast.promise(promise(), {
            loading: "Desactivando usuario...",
            success: "Usuario desactivado exitosamente",
            error: (error) => error.message,
        });
    };

    const onReactivateUser = async(id: string) => {
        const promise = async() => await reactivateUser(id).unwrap();

        toast.promise(promise(), {
            loading: "Desactivando usuario...",
            success: "Usuario desactivado exitosamente",
            error: (error) => error.message,
        });
    };

    return {
        users,
        error,
        isLoading,
        isFetching,
        refetch,
        onDesactivateUser,
        onReactivateUser,
        isSuccessDeleteUser,
        isSuccessReactivateUser,
        totalUsers: users.length,
        getUser: (id: string) => users.find((user) => user.id === id),
    };
};
