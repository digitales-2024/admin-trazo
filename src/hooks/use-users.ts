import {
    useGetUsersQuery,
    useDeleteUserMutation,
    useReactivateUserMutation,
} from "@/redux/services/usersApi";
import { CustomErrorData } from "@/types";
import { translateError } from "@/utils/translateError";
import { toast } from "react-hot-toast";

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
    const onDesactivateUser = async (id: string) => {
        const promise = async () => {
            try {
                const result = await deleteUser(id).unwrap();
                return result;
            } catch (error) {
                if (
                    typeof error === "object" &&
                    error !== null &&
                    "data" in error
                ) {
                    const customError = error.data as CustomErrorData;
                    const message = translateError(customError.message);
                    throw new Error(message);
                }
                throw new Error(
                    "Ocurrió un error inesperado, por favor intenta de nuevo",
                );
            }
        };

        toast.promise(promise(), {
            loading: "Desactivando usuario...",
            success: "Usuario desactivado exitosamente",
            error: (error) => error.message,
        });
    };

    const onReactivateUser = async (id: string) => {
        const promise = async () => {
            try {
                const result = await reactivateUser(id).unwrap();
                return result;
            } catch (error) {
                if (
                    typeof error === "object" &&
                    error !== null &&
                    "data" in error
                ) {
                    const customError = error.data as CustomErrorData;
                    const message = translateError(customError.message);
                    throw new Error(message);
                }
                throw new Error(
                    "Ocurrió un error inesperado, por favor intenta de nuevo",
                );
            }
        };

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
